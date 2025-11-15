const fs = require('fs');
const { execSync } = require('child_process');

const START_DATE = new Date('2025-11-15T09:00:00');
const END_DATE = new Date('2025-12-14T18:00:00');
const TOTAL_COMMITS = 100;

const MESSAGES = [
    "fix: typo in readme",
    "update docker configuration",
    "add console logs for debugging",
    "fix: server port issue",
    "wip: working on pipeline",
    "ci: try to fix github actions",
    "test: added simple test",
    "style: formatting changes",
    "refactor: clean up code",
    "chore: update dependencies",
    "fix: env vars",
    "docs: update installation steps",
    "feat: initial setup",
    "fix: build failing",
    "oops, forgot to save",
    "remove console logs",
    "update .gitignore",
    "docker: switch to alpine",
    "docker: switch back to slim",
    "fix: permission denied",
    "try to fix build",
    "another attempt at fixing build",
    "maybe this works",
    "final fix",
    "really final fix",
    "cleanup comments",
    "update package.json scripts",
    "add header comments",
    "fix indentation",
    "update todo list"
];

const FILES = [
    'readme.md',
    'src/server.js',
    'Dockerfile',
    'package.json'
];

// Helper to get random item
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate dates
const dates = [];
const interval = (END_DATE.getTime() - START_DATE.getTime()) / TOTAL_COMMITS;

for (let i = 0; i < TOTAL_COMMITS; i++) {
    const baseTime = START_DATE.getTime() + (interval * i);
    // Add some randomness +/- 2 hours
    const noise = randomInt(-7200000, 7200000);
    dates.push(new Date(Math.max(START_DATE.getTime(), Math.min(END_DATE.getTime(), baseTime + noise))));
}

// Ensure unique commits by keeping state or appending unique comments
let counter = 0;

function modifyFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    if (file.endsWith('.md')) {
        // Toggle a specialized comment or whitespace
        if (content.includes('<!-- updated -->')) {
            newContent = content.replace('<!-- updated -->', '');
        } else {
            newContent = content + '\n<!-- updated -->';
        }
    } else if (file.endsWith('.js')) {
        if (content.includes('// updated')) {
            newContent = content.replace(/\/\/ updated \d+/, `// updated ${Date.now()}`);
        } else {
            newContent = content + `\n// updated ${Date.now()}`;
        }
    } else if (file === 'Dockerfile') {
        if (content.includes('# version')) {
            newContent = content.replace(/# version \d+/, `# version ${counter}`);
        } else {
            newContent = content + `\n# version ${counter}`;
        }
    } else if (file === 'package.json') {
        // safely add a space at the end
        if (content.endsWith(' \n')) {
            newContent = content.trimEnd() + '\n';
        } else {
            newContent = content + ' \n';
        }
    }

    fs.writeFileSync(file, newContent);
}

console.log(`Generating ${TOTAL_COMMITS} commits...`);

for (let i = 0; i < TOTAL_COMMITS; i++) {
    const date = dates[i];
    const file = sample(FILES);
    const msg = sample(MESSAGES);

    // Modify file
    counter++;
    try {
        modifyFile(file);
    } catch (e) {
        // If file doesn't exist or error, just append to README
        modifyFile('README.md');
    }

    // Git commands
    try {
        execSync(`git add .`);
        // Format date for git commit --date
        const dateStr = date.toISOString();
        execSync(`git commit -m "${msg}" --date="${dateStr}"`, {
            env: { ...process.env, GIT_AUTHOR_DATE: dateStr, GIT_COMMITTER_DATE: dateStr }
        });
        console.log(`[${i + 1}/${TOTAL_COMMITS}] Committed "${msg}" on ${dateStr}`);
    } catch (e) {
        console.error(`Failed to commit ${i}: ${e.message}`);
    }
}

console.log('Done!');
