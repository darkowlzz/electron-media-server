'use strict';

const debug = require('debug')('main');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const volume = require('osx-volume');
const http = require('http');

const PORT = 7000;
const VOLUME_CHANGE = 10;

let CURRENT_VOLUME = 0;
let window = null;

function increaseVol() {
  CURRENT_VOLUME += VOLUME_CHANGE;
  return CURRENT_VOLUME;
}

function decreaseVol() {
  CURRENT_VOLUME -= VOLUME_CHANGE;
  return CURRENT_VOLUME;
}

function handleRequest(req, res) {
  debug('request:', req.method);
  debug('req url:', req.url);

  switch (req.url) {
    case '/vol/up':
      debug('Vol UP!');
      volume.set(increaseVol());
      break;
    case '/vol/down':
      debug('Vol DOWN!');
      volume.set(decreaseVol());
      break;
    case '/vol':
      debug('returning volume');
      volume.get(function(value) {
        debug(value);
        res.end(value);
      });
      break;
    default:

  }

  res.end('It works!');
}

const server = http.createServer(handleRequest);

app.on('ready', () => {
  window = new BrowserWindow({
    'title-bar-style': 'hidden',
    width: 250,
    height: 300,
    'min-width': 250,
    'min-height': 300,
    'accept-first-mouse': true
  });

  window.loadURL('file://' + __dirname + '/dashboard.html');

  window.on('closed', () => {
    window = null;
  });

  volume.get(function(value) {
    CURRENT_VOLUME = parseInt(value);
  });

  ipcMain.on('async-on-server', (event, arg) => {
    debug('main received', arg);
    if (arg === true) {
      server.listen(PORT, () => {
        debug('Server ON');
        event.sender.send('async-on-server', 101);
      });
    } else {
      server.close(() => {
        debug('Server OFF');
        event.sender.send('async-on-server', 102);
      });
    }
  });

  ipcMain.on('sync-message', (event, arg) => {
    debug(arg);
    event.returnValue = PORT;
  });
});
