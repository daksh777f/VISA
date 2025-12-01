const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

console.log('Checking .env.local at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('File exists.');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    let keyFound = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('GOOGLE_API_KEY=')) {
            keyFound = true;
            const value = trimmed.split('=')[1];
            if (value && value.length > 10) {
                console.log('GOOGLE_API_KEY found: Yes');
                console.log('Key starts with:', value.substring(0, 4));
            } else {
                console.log('GOOGLE_API_KEY found but appears empty or too short.');
            }
        }
    });

    if (!keyFound) {
        console.log('GOOGLE_API_KEY NOT found in file.');
    }
} else {
    console.log('File does NOT exist.');
}
