var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
app.on('ready', function(){
	var screenDimensions = electron.screen.getPrimaryDisplay();
	//console.log(screenDimensions);
	var mainWindow = new BrowserWindow({
		width: screenDimensions.bounds.width,
		height : screenDimensions.bounds.height,
		icon: __dirname + "/images/Anna.png"
	})
	mainWindow.loadURL('file://' + __dirname + '/index.html')
})
