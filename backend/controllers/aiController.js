const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with fallback
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDHKHTNpctunVPUXgygI3gAprDEhJmD6I4';
const genAI = new GoogleGenerativeAI(apiKey);

// Validate API key
if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.warn('⚠️  GEMINI_API_KEY not properly configured. Please set it in your .env file.');
}

exports.generateComponent = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: 'Prompt is required.' });

        // Create a system prompt for generating React components
        const systemPrompt = `You are an expert React developer specializing in creating modern, responsive components. Generate React components based on user requests.

        CRITICAL REQUIREMENTS:
        1. Return ONLY valid JSX that can be rendered directly in a browser
        2. Use inline styles for immediate visual feedback
        3. Make components responsive and mobile-friendly
        4. Use semantic HTML elements (button, nav, main, section, etc.)
        5. Include proper accessibility attributes (aria-label, role, etc.)
        6. Keep code clean, readable, and well-structured
        7. Never use external dependencies, imports, or require statements
        8. Use modern CSS-in-JS patterns with inline styles
        9. Ensure components are self-contained and functional
        10. Add hover effects and smooth transitions where appropriate
        11. Use a modern color palette and typography
        12. Make components interactive when requested

        User Request: "${prompt}"

        RESPONSE FORMAT (exactly as shown):
        JSX: [your complete jsx component here]
        CSS: [additional css styles if needed]
        Explanation: [brief description of what the component does]

        IMPORTANT: The JSX must be complete and ready to render. Include all necessary inline styles.`;

        // Generate content using Gemini with fallback models
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let text = '';
        let lastError = null;

        for (const modelName of models) {
            try {
                console.log(`🔄 Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(systemPrompt);
                const response = await result.response;
                text = response.text();
                console.log(`✅ Successfully used model: ${modelName}`);
                break;
            } catch (error) {
                console.log(`❌ Model ${modelName} failed:`, error.message);
                lastError = error;
                continue;
            }
        }

        if (!text) {
            throw new Error(`All models failed. Last error: ${lastError?.message}`);
        }

        // Parse the response to extract JSX and CSS
        let jsxCode = '';
        let cssCode = '';
        let message = '';

        // Try to extract JSX and CSS from the response using multiple patterns
        const jsxMatch = text.match(/JSX:\s*([\s\S]*?)(?=CSS:|Explanation:|$)/i) ||
            text.match(/```jsx\s*([\s\S]*?)\s*```/i) ||
            text.match(/```\s*([\s\S]*?)\s*```/i);

        const cssMatch = text.match(/CSS:\s*([\s\S]*?)(?=JSX:|Explanation:|$)/i) ||
            text.match(/```css\s*([\s\S]*?)\s*```/i);

        const explanationMatch = text.match(/Explanation:\s*([\s\S]*?)(?=JSX:|CSS:|$)/i);

        if (jsxMatch && jsxMatch[1]) {
            jsxCode = jsxMatch[1].trim();
        } else {
            // Fallback: try to extract any JSX-like code from the response
            const jsxPattern = /<[^>]*>[\s\S]*?<\/[^>]*>|<[^>]*\/>/;
            const jsxFound = text.match(jsxPattern);
            if (jsxFound) {
                jsxCode = jsxFound[0];
            } else {
                // Last resort: create a simple component with the AI response
                jsxCode = `<div style={{ 
                    padding: '24px', 
                    textAlign: 'center', 
                    color: '#64748b',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#334155' }}>Generated Component</h3>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>${text.substring(0, 200)}${text.length > 200 ? '...' : ''}</p>
                </div>`;
            }
        }

        if (cssMatch && cssMatch[1]) {
            cssCode = cssMatch[1].trim();
        }

        if (explanationMatch && explanationMatch[1]) {
            message = explanationMatch[1].trim();
        } else {
            message = `Generated component based on: "${prompt}"`;
        }

        // Clean up the JSX and CSS code - remove any markdown formatting
        jsxCode = jsxCode.replace(/```jsx?/g, '').replace(/```/g, '').trim();
        cssCode = cssCode.replace(/```css/g, '').replace(/```/g, '').trim();

        // Ensure we have valid JSX
        if (!jsxCode.includes('<')) {
            jsxCode = `<div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                color: '#64748b',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#334155' }}>Generated Component</h3>
                <p style={{ margin: 0, lineHeight: '1.6' }}>${text.substring(0, 200)}${text.length > 200 ? '...' : ''}</p>
            </div>`;
        }

        // Validate and clean JSX
        if (jsxCode.includes('import ') || jsxCode.includes('require(')) {
            jsxCode = jsxCode.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '');
            jsxCode = jsxCode.replace(/const\s+.*?require\([^)]*\);?\s*/g, '');
        }

        res.json({
            jsx: jsxCode,
            css: cssCode,
            message: message
        });

    } catch (err) {
        console.error('Gemini API Error:', err);
        res.status(500).json({
            message: 'AI generation error',
            error: err.message,
            jsx: `<div style={{ padding: '20px', textAlign: 'center', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px' }}>
                <h3>Error Generating Component</h3>
                <p>There was an error generating your component. Please try again.</p>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>Error: ${err.message}</p>
            </div>`,
            css: ''
        });
    }
}; 
