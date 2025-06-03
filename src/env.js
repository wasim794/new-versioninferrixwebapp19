(function (window) {
  const windows = this.getWindow();
  window.__env = window.__env || {};
  if (windows.location.protocol === 'https:') {
    windows.__env.apiUrl = 'https:';
    windows.__env.wssUrl = 'wss:';
  } else {
    windows.__env.apiUrl = 'http:';
    windows.__env.wssUrl = 'ws:';
  }
    window.__env.apiUrl += `//${windows.location.hostname}/rest`;
    window.__env.wssUrl += `//${windows.location.hostname}/rest/ws`;
  window.__env.enableDebug = true;
}(this));
