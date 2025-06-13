#!/usr/bin/env node

const { Command } = require('commander');
const packageJson = require('../package.json');
const ProjectInitializer = require('../src/init');

const program = new Command();

program
	.name('wp-monorepo')
	.description('A build tool for managing WordPress themes and plugins in a monorepo structure')
	.version(packageJson.version);

// Initialize a new WordPress monorepo project
program
	.command('init')
	.description('Initialize a new WordPress monorepo project')
	.option('-d, --directory <path>', 'Directory to initialize the project in', process.cwd())
	.option('-n, --name <name>', 'Project name', 'wp-monorepo')
	.action(async options => {
		try {
			const initializer = new ProjectInitializer(options);
			await initializer.initialize();
		} catch (error) {
			console.error('Error initializing project:', error.message);
			process.exit(1);
		}
	});

// Add a new theme to the project
program
	.command('add theme <name>')
	.description('Add a new theme to the project')
	.option('-d, --directory <path>', 'Theme directory', 'wp-content/themes')
	.action(async (name, options) => {
		try {
			// TODO: Implement theme creation logic
			console.log(`Adding new theme: ${name}`);
			console.log(`Theme directory: ${options.directory}`);
		} catch (error) {
			console.error('Error adding theme:', error.message);
			process.exit(1);
		}
	});

// Add a new plugin to the project
program
	.command('add plugin <name>')
	.description('Add a new plugin to the project')
	.option('-d, --directory <path>', 'Plugin directory', 'wp-content/plugins')
	.action(async (name, options) => {
		try {
			// TODO: Implement plugin creation logic
			console.log(`Adding new plugin: ${name}`);
			console.log(`Plugin directory: ${options.directory}`);
		} catch (error) {
			console.error('Error adding plugin:', error.message);
			process.exit(1);
		}
	});

// Build command
program
	.command('build')
	.description('Build all themes and plugins')
	.option('-w, --workspace <name>', 'Build specific workspace')
	.action(async options => {
		try {
			// TODO: Implement build logic
			console.log('Building projects...');
			if (options.workspace) {
				console.log(`Building workspace: ${options.workspace}`);
			}
		} catch (error) {
			console.error('Error building projects:', error.message);
			process.exit(1);
		}
	});

// Parse command line arguments
program.parse();
