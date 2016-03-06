document.addEventListener('DOMContentLoaded', function() {

  const ipcRenderer = require('electron').ipcRenderer;
  const volume = require('osx-volume');
  const address = require('network-address');
  const storage = require('electron-json-storage');

  const onButton = document.getElementById('server-on');
  const offButton = document.getElementById('server-off');
  const port = document.getElementById('port');
  var vol = document.getElementById('vol');
  var status = document.getElementById('status');

  const STORAGE_KEY = 'server';

  storage.get(STORAGE_KEY, (error, data) => {
    port.value = !! data.port ? data.port : 7000;
  });

  setInterval(updateVolume, 500);

  ipcRenderer.on('async-run-server', (event, arg) => {
    setStatus('Server running at ' + address() + ':' + port.value);
    // Remember port number on a successful server connection
    saveData();
  });

  ipcRenderer.on('async-stop-server', (event, arg) => {
    setStatus('Server not running.');
  });

  onButton.addEventListener('click', () => {
    onButton.classList.add('active');
    ipcRenderer.send('async-run-server', port.value);
  });

  offButton.addEventListener('click', () => {
    onButton.classList.remove('active');
    ipcRenderer.send('async-stop-server', true);
  });

  // Fetch and update the system volume value
  function updateVolume() {
    volume.get(function(value) {
      vol.textContent = value;
    });
  }

  // Set the status in footer status bar
  function setStatus(text) {
    status.textContent = text;
  }

  // Save app data
  function saveData() {
    storage.set(STORAGE_KEY,
      {
        'port': port.value
      }
    );
  }
});
