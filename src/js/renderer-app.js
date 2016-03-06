document.addEventListener('DOMContentLoaded', function() {

  const ipcRenderer = require('electron').ipcRenderer;
  const volume = require('osx-volume');
  const address = require('network-address');
  const onButton = document.getElementById('server-on');
  const offButton = document.getElementById('server-off');
  var vol = document.getElementById('vol');
  var status = document.getElementById('status');

  //status.textContent = 'Server not running';
  setInterval(updateVolume, 500);

  ipcRenderer.on('async-on-server', (event, arg) => {
    console.log(arg);
    if (arg ===  101) {
      setStatus('Server running at ' + address() + ':' +
                ipcRenderer.sendSync('sync-message', 'getPort'));
    } else if(arg === 102) {
      setStatus('Server not running.');
    }
  });

  onButton.addEventListener('click', () => {
    console.log('clicked and message sent');
    onButton.classList.add('active');
    ipcRenderer.send('async-on-server', true);
  });

  offButton.addEventListener('click', () => {
    onButton.classList.remove('active');
    ipcRenderer.send('async-on-server', false);
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
});
