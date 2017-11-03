const babel = require("babel-core");
const transform = require('babel-core').transform;
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const fileList = ['app.js', 'src/AnalyticsWidget.js'];
const outDir = path.join(__dirname, 'build');

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir);
}

const folders = ['routes', 'models', 'bin', 'utils', 'src'];

folders.forEach((folder) => {
	if (!fs.existsSync(path.join(outDir, folder))) {
		fs.mkdir(path.join(outDir, folder));
	}

	const files = fs.readdirSync(folder);

	files.forEach((file) => {
		fileList.push(path.join(folder, file))
	});
});

fileList.forEach((file) => {
	let code = fs.readFileSync(file, 'utf-8');

	// append the import to get around a bug
	if ((code.indexOf('await') > -1) || (code.indexOf('async') > -1)) {
		code = `import 'regenerator-runtime/runtime';${code}`;
	}
	const result = babel.transform(code, {presets: ["env"]});

	fs.writeFileSync(path.join('build', file), result.code);
});


// set file watchers, persist. Watches entire root directory
const watcher = chokidar.watch('.', {
	ignored: ['build/', '.idea/', '.git/', 'client/'],
	persistent: true
});

watcher
  .on('ready', () => {
  	console.log('\u2713 Initial scan complete. Ready for changes')
  })
	.on('change', (filePath) => {
		console.log(filePath, 'changd');

		// const result = babel.transformFileSync(filePath, {});
		// fs.writeFileSync(path.join('build', filePath), result.code);

		let code = fs.readFileSync(filePath, 'utf-8');

		// append the import to get around a bug
		if ((code.indexOf('await') > -1) || (code.indexOf('async') > -1)) {
			code = `import 'regenerator-runtime/runtime';${code}`;
		}
		const result = babel.transform(code, {presets: ["env"]});
		fs.writeFileSync(path.join('build', filePath), result.code);
	})
	.on('error', (error) => {
		console.log('Error happened', error);
	})


