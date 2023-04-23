const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js")
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#ebebeb',
            symbolColor: '#111',
            height: 59
        },
		icon: 'app/assets/logo/SFlogoOpaque.png'
    })
    win.loadFile('app/index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})


ipcMain.handle('notification', async (event, arg) => {
    return new Promise(function(resolve, reject) {
        resolve("this worked!")
        new Notification({
            title: arg[0],
            body: arg[1],
        }).show()
    })
})

// Storage System

const fs = require('fs')
const username = require("os").userInfo().username
const dataDir = '/Users/'+username+'/Documents/Midelight/StudyFocus/'

function saveStorage(storage){
    if (!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFile(dataDir + "data", storage, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    })
}

function loadStorage(){
    return new Promise(function(resolve, reject) {
        fs.readFile(dataDir + "data", 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            resolve(data);
        })
    })
}

// saveStorage("hiii :3")



ipcMain.handle('storage', async (event, arg) => {
    return new Promise(function(resolve, reject) {
        if(arg[0]=="save"){
            saveStorage(arg[1])
        }
        if(arg[0]=="load"){
            loadStorage()
                .then(function(res){
                    resolve(res)
                })
        }
    })
})