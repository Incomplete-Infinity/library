const fs = require('fs');
const path = require('path');

// Replace with the desired root directory
const rootDir = __dirname;

// source directory
const srcDir = path.join(rootDir, 'src');

// Directory for storing the generated JavaScript files
const distDir = path.join(rootDir, 'dist');

// Configuration file path
const configFile = path.join(rootDir, 'conf.json');

/**
 * Traverses the directories recursively starting from the specified directory.
 *
 * @param {string} directory - The current directory to traverse.
 */
function traverseDirectories(directory) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.') && directory !== distDir) {
      processFilesInDirectory(filePath);
    }
  });
}

/**
 * Processes the files within a directory.
 *
 * @param {string} directory - The directory to process.
 */
function processFilesInDirectory(directory) {
  const files = fs.readdirSync(directory);
  const functions = [];

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && path.extname(file) === '.md') {
      const fileFunctions = processMarkdownFile(filePath);
      functions.push(...fileFunctions);
    }
  });

  if (functions.length > 0) {
    const dirName = path.basename(directory);
    const jsFilePath = path.join(distDir, `${dirName}.js`);
    const jsContent = functions.join('\n\n');
    fs.writeFileSync(jsFilePath, jsContent);
    console.log(`Created ${jsFilePath}`);
    updateConfigFile(jsFilePath);
  } else {
    const dirName = path.basename(directory);
    const jsFilePath = path.join(distDir, `${dirName}.js`);
    const jsContent = '// No scripts found';
    fs.writeFileSync(jsFilePath, jsContent);
    console.log(`Created ${jsFilePath}`);
    updateConfigFile(jsFilePath);
  }
}

/**
 * Processes a markdown file and extracts functions from code blocks.
 *
 * @param {string} filePath - The path to the markdown file.
 * @returns {string[]} - An array of extracted functions.
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /### Code(?:.|[\r\n])*?```(?:js|javascript|JavaScript)([\s\S]*?)```/g;
  const matches = [...content.matchAll(regex)];
  const functions = matches.map((match) => match[1].trim());
  return functions;
}

/**
 * Updates the configuration file with the path of the generated JavaScript file.
 *
 * @param {string} jsFilePath - The path of the generated JavaScript file.
 */
function updateConfigFile(jsFilePath) {
  const config = require(configFile);
  const relativePath = `./${path.basename(jsFilePath)}`;
  if (!config.source.include.includes(relativePath)) {
    config.source.include.push(relativePath);
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(`Updated ${configFile}`);
  }
}

/**
 * Creates the configuration file if it doesn't exist.
 */
function createConfigFileIfNotExists() {
  if (!fs.existsSync(configFile)) {
    const initialConfig = {
      source: {
        include: []
      },
      plugins: [
        'plugins/markdown',
        'plugins/summarize'
      ],
      markdown: {
        parser: 'gfm',
        hardwrap: false,
        idInHeadings: true
      },
      templates: {
        cleverLinks: false,
        monospaceLinks: false,
        name: 'library-gs',
        footerText: 'PhobiaCide',
        tabNames: {
          api: 'API',
          tutorials: 'Examples'
        }
      },
      metadata: {
        title: 'library-gs'
      },
      opts: {
        'prism-theme': 'prism-custom',
        encoding: 'utf8',
        recurse: true,
        package: 'package.json',
        readme: 'README.md',
        destination: './.docs/',
        verbose: true,
        template: './node_modules/docdash',
        theme_opts: {
          default_theme: 'dark'
        }
      }
    };

    fs.writeFileSync(configFile, JSON.stringify(initialConfig, null, 2));
    console.log(`Created ${configFile}`);
  }
}

// Create the .dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log(`Created ${distDir}`);
}

// Create the config file if it doesn't exist
createConfigFileIfNotExists();

// Start traversing the directories from the root
traverseDirectories(srcDir);
