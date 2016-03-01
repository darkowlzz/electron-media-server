'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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
  console.log('request:', req.method);
  console.log('req url:', req.url);

  switch (req.url) {
    case '/vol/up':
      console.log('Vol UP!');
      volume.set(increaseVol());
      break;
    case '/vol/down':
      console.log('Vol DOWN!');
      volume.set(decreaseVol());
      break;
    default:

  }

  res.end('It works!');
}

const server = http.createServer(handleRequest);

app.on('ready', () => {
  window = new BrowserWindow({width: 400, height: 400});
  window.loadURL('file://' + __dirname + '/dashboard.html');

  volume.get(function(value) {
    CURRENT_VOLUME = parseInt(value);
  });

  server.listen(PORT, function() {
    console.log('Server ON');
  });
});
