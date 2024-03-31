const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const { SerialPort } = require('serialport')
const fs = require('fs');

let mainWindow;

let mainSerialPort = null
let payloadSerialPort = null
let HyiSerialPort = null

app?.on('ready', () => {
   
mainWindow = new BrowserWindow({
    width:1200,
    height:700,
  icon: path.join(__dirname,"/orsaq.png"),
  autoHideMenuBar: true,
  frame: false,
    webPreferences:{
        worldSafeExecuteJavaScript: true,
        nodeIntegration: true,
        contextIsolation: false,
        
    }
});
mainWindow.loadURL(
    url.format({
        pathname: path.join(__dirname,"orsamain.html"),
        protocol: "file",
        slashes: true
    })
);
mainWindow?.on('closed', () => {
    mainWindow = null;
    });
});
app?.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

let maximizeToggle = false; //toggle back to original window size if maximize click again
ipcMain?.on("manualMinimize", () =>{
    mainWindow.minimize();
});
ipcMain?.on("manualMaximize", () =>{
    if(maximizeToggle){
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
    maximizeToggle=!maximizeToggle;
});
ipcMain?.on("manualClose" , () => {
    app.quit();
})
function byteToFloat(bytes) {
    // bytes is an array of 4 bytes, eg [0x44, 0x6F, 0x33, 0x33] and uses little endian
    const bits = bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
    const sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
    const e = bits >>> 23 & 0xff;
    const m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    const f = sign * m * Math.pow(2, e - 150);
    return f;
}

ipcMain?.on('connect', (event, port, baudRate, portName) => {
    if (portName == "main") {
        mainSerialPort = new SerialPort({
            baudRate: Number(baudRate),
            autoOpen: false,
            path: port,
        });
        mainSerialPort.open();

        mainSerialPort?.on('open', () => {
            mainWindow.webContents.send('connection-opened', port);
        });

        let buffer = ''

        mainSerialPort?.on('data', (data) => {
            buffer = buffer + data.toString();
            if (buffer.indexOf('\r\n') !== -1) {
                console.log('data: ',buffer.toString());
                mainWindow.webContents.send('data-received', buffer.toString())
                
                buffer = ''
            }
        });

        mainSerialPort?.on('error', (err) => {
            console.log(err);
            mainWindow.webContents.send('connection-error', err);
        });

        mainSerialPort?.on('close', () => {
            mainWindow.webContents.send('connection-closed');
        });
    } else if (portName == "payload") {
        payloadSerialPort = new SerialPort({
            baudRate: Number(baudRate),
            autoOpen: false,
            path: port,
        });
        payloadSerialPort.open();

        payloadSerialPort?.on('open', () => {
            mainWindow.webContents.send('connection-opened', port);
        });

      let buffer2 = ''
        

        payloadSerialPort?.on('data', (data) => {
          
            buffer2 = buffer2 + data.toString();
            if (buffer2.indexOf('\r\n') !== -1) {
                console.log('data: ',buffer2.toString());
                mainWindow.webContents.send('data-received-payload', buffer2.toString())
                
                buffer2 = ''
            }
        });

        payloadSerialPort?.on('error', (err) => {
            console.log(err);
            mainWindow.webContents.send('connection-error', err);
        });

        payloadSerialPort?.on('close', () => {
            mainWindow.webContents.send('connection-closed');
        });
    } else if (portName == "hyi") {
        HyiSerialPort = new SerialPort({
            baudRate: Number(baudRate),
            autoOpen: false,
            path: port,
        });
        HyiSerialPort.open();

        HyiSerialPort?.on('open', () => {
            console.log("Connection opened HYI");
            mainWindow.webContents.send('connection-opened', port);
        });

        HyiSerialPort?.on('error', (err) => {
            console.log(err);
            mainWindow.webContents.send('connection-error', err);
            HyiSerialPort = null;
        });

        HyiSerialPort?.on('close', () => {
            mainWindow.webContents.send('connection-closed');
            HyiSerialPort = null;
        });
    } else {
        console.log("Error: No port name specified" + portName);
    }
});

ipcMain?.on('refresh-port-list', (event) => {
    SerialPort.list().then(ports => {
        mainWindow.webContents.send('port-list', ports);
    });
});

ipcMain?.on('send-hyi', (event, data) => {
    if (HyiSerialPort != null) {
        if(HyiSerialPort.isOpen){
            console.log("Sending: " + data);
            HyiSerialPort.write(data);
        }
        else
            console.log("Error: Port is not open");
    } else {
        console.log("Error: No port selected");
    }
});


