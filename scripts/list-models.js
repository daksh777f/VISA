const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Get API Key
const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('GOOGLE_API_KEY=')) {
            apiKey = trimmed.split('=')[1].trim();
        }
    });
}

if (!apiKey) {
    console.error('Could not find GOOGLE_API_KEY in .env.local');
    process.exit(1);
}

console.log('Using API Key: ' + apiKey.substring(0, 4) + '...');

// 2. Call ListModels API
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else if (json.models) {
                console.log('Available Models:');
                const modelList = [];
                json.models.forEach(m => {
                    if (m.name.toLowerCase().includes('gemini')) {
                        modelList.push(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
                    }
                });
                fs.writeFileSync(path.join(__dirname, '..', 'gemini_models.txt'), modelList.join('\n'), 'utf8');
                console.log('Wrote models to gemini_models.txt');
            } else {
                console.log('Unexpected response:', data);
            }
        } catch (e) {
            console.error('Failed to parse response:', e.message);
            console.log('Raw response:', data);
        }
    });

}).on('error', (err) => {
    console.error('Network Error:', err.message);
});
