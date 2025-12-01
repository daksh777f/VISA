const fs = require('fs');
const path = require('path');

function removeComments(code) {
    let result = '';
    let i = 0;

    while (i < code.length) {
        if (code[i] === '/' && code[i + 1] === '/') {
            while (i < code.length && code[i] !== '\n') {
                i++;
            }
            if (i < code.length) {
                result += '\n';
                i++;
            }
        }
        else if (code[i] === '/' && code[i + 1] === '*') {
            i += 2;
            while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) {
                i++;
            }
            i += 2;
        }
        else if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
            const quote = code[i];
            result += code[i++];
            while (i < code.length) {
                if (code[i] === '\\') {
                    result += code[i++];
                    if (i < code.length) result += code[i++];
                } else if (code[i] === quote) {
                    result += code[i++];
                    break;
                } else {
                    result += code[i++];
                }
            }
        }
        else {
            result += code[i++];
        }
    }

    return result.replace(/\n\s*\n\s*\n/g, '\n\n');
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleaned = removeComments(content);
        fs.writeFileSync(filePath, cleaned, 'utf8');
        console.log(`✓ Processed: ${filePath}`);
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
    }
}

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules') {
                walkDir(filePath, fileList);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const projectRoot = path.join(__dirname, '..');
const files = walkDir(projectRoot);

console.log(`Found ${files.length} TypeScript/TSX files\n`);

files.forEach(processFile);

console.log(`\n✓ Completed processing ${files.length} files`);
