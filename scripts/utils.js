const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Helper functions
function createDirectory(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function writeFile(filePath, content) {
	fs.writeFileSync(filePath, content);
}

function promptUser(question) {
	return new Promise(resolve => {
		rl.question(question, answer => {
			resolve(answer);
		});
	});
}

function promptYesNo(question) {
	return new Promise(resolve => {
		rl.question(question, answer => {
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
		});
	});
}

// Convert name to lowercase hyphenated folder name
function toFolderName(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function isWordPressInstallation(dir) {
	// Check for common WordPress files/directories
	const wpFiles = ['wp-config.php', 'wp-content', 'wp-includes', 'wp-admin'];
	return wpFiles.some(file => fs.existsSync(path.join(dir, file)));
}

function closeReadline() {
	rl.close();
}

// Shared configuration objects
const SHARED_DEPENDENCIES = {
	'@wordpress/browserslist-config': '^6.25.0',
	'@wordpress/eslint-plugin': '22.11.0',
	'@wordpress/scripts': '30.18.0',
	'css-loader': '^7.1.2',
	'eslint-config-wordpress': '2.0.0',
	'mini-css-extract-plugin': '^2.8.1',
	'postcss-import': '^16.1.0',
	prettier: '3.5.3',
	sass: '^1.71.0',
	'sass-loader': '^16.0.5',
	stylelint: '16.20.0',
	'stylelint-scss': '^6.11.1',
	turbo: '2.5.4',
	'webpack-remove-empty-scripts': '^1.0.0',
};

const SHARED_SCRIPTS = {
	build: 'turbo run build',
	'build:dev': 'turbo run build:dev',
	'build:prod': 'turbo run build:prod',
	start: 'turbo run start',
	lint: 'turbo run lint',
	format: 'turbo run format',
	clean: 'turbo run clean',
};

const TURBO_CONFIG = {
	$schema: 'https://turbo.build/schema.json',
	globalDependencies: ['**/.env.*local'],
	tasks: {
		build: {
			dependsOn: ['^build'],
			outputs: ['dist/**'],
		},
		'build:dev': {
			dependsOn: ['^build:dev'],
			outputs: ['dist/**'],
		},
		'build:prod': {
			dependsOn: ['^build:prod'],
			outputs: ['dist/**'],
		},
		start: {
			cache: false,
			persistent: true,
		},
		lint: {
			outputs: [],
		},
		format: {
			outputs: [],
		},
		clean: {
			cache: false,
		},
	},
};

const GITIGNORE_CONTENT = `# Dependencies
node_modules/

# Build artifacts
dist/

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
`;

module.exports = {
	createDirectory,
	writeFile,
	promptUser,
	promptYesNo,
	toFolderName,
	isWordPressInstallation,
	closeReadline,
	SHARED_DEPENDENCIES,
	SHARED_SCRIPTS,
	TURBO_CONFIG,
	GITIGNORE_CONTENT,
};
