'use strict';

require('regenerator-runtime/runtime');

var babel = require("babel-core");
var transform = require('babel-core').transform;
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');
var fileList = ['app.js', 'AnalyticsWidget.js'];
var outDir = path.join(__dirname, 'build');

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir);
}

var folders = ['routes', 'models', 'bin', 'utils', 'src'];

folders.forEach(function (folder) {
	if (!fs.existsSync(path.join(outDir, folder))) {
		fs.mkdir(path.join(outDir, folder));
	}

	var files = fs.readdirSync(folder);

	files.forEach(function (file) {
		fileList.push(path.join(folder, file));
	});
});

fileList.forEach(function (file) {
	var code = fs.readFileSync(file, 'utf-8');

	// append the import to get around a bug
	if (code.indexOf('await') > -1 || code.indexOf('async') > -1) {
		code = 'import \'regenerator-runtime/runtime\';' + code;
	}
	var result = babel.transform(code, { presets: ["env"] });

	fs.writeFileSync(path.join('build', file), result.code);
});

// set file watchers, persist. Watches entire root directory
var watcher = chokidar.watch('.', {
	ignored: ['build/', '.idea/', '.git/', 'client/'],
	persistent: true
});

watcher.on('ready', function () {
	console.log('\u2713 Initial scan complete. Ready for changes');
}).on('change', function (filePath) {
	console.log(filePath, 'changd');

	// const result = babel.transformFileSync(filePath, {});
	// fs.writeFileSync(path.join('build', filePath), result.code);

	var code = fs.readFileSync(filePath, 'utf-8');

	// append the import to get around a bug
	if (code.indexOf('await') > -1 || code.indexOf('async') > -1) {
		code = 'import \'regenerator-runtime/runtime\';' + code;
	}
	var result = babel.transform(code, { presets: ["env"] });
	fs.writeFileSync(path.join('build', filePath), result.code);
}).on('error', function (error) {
	console.log('Error happened', error);
});