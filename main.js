const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let alwaysOnTop = true;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

function toggleAlwaysOnTop(value) {
    alwaysOnTop = value;
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    console.log(`alwaysOnTop is now: ${alwaysOnTop}`);
}

ipcMain.on('toggle-always-on-top', (event, value) => {
    toggleAlwaysOnTop(value);
});