let websocket: WebSocket;

function onTaxerFinanceOperationsPageLoad(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
  chrome.pageAction.show(details.tabId);
  createWebSocketConnection(event => {
    const receivedMsg = JSON.parse(event.data);
    chrome.tabs.sendMessage(details.tabId, receivedMsg, response => {
      if (websocket) {
        websocket.send(response);
      }
    });
  });
}

function createWebSocketConnection(messageHandler) {
  if ('WebSocket' in window) {
    chrome.storage.sync.get(({ serverUrl }) => {
      console.log('server url: ', serverUrl);
      const tryConnect = () => {
        try {
          connect(serverUrl, messageHandler);
          return true;
        } catch (error) {
          return false;
        }
      };
      if (!tryConnect()) {
        const interval = setInterval(() => {
          if (tryConnect()) { clearInterval(interval); }
        }, 1000);
      }
    });
  }
}

// Make a websocket connection with the server
// and an inner connection with content script.
function connect(host, messageHandler) {
  if (websocket == null) {
    websocket = new WebSocket(host);
  }

  websocket.onopen = () => {};

  websocket.onmessage = messageHandler;

  // If the websocket is closed but the session is still active, create new connection again
  websocket.onclose = () => {
    websocket = undefined;
    createWebSocketConnection(messageHandler);
  };
}

// Close the websocket connection
function closeWebSocketConnection(username) {
  if (websocket != null) {
    websocket.close();
    websocket = undefined;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.webNavigation.onCompleted.addListener(onTaxerFinanceOperationsPageLoad, {
    url: [{ urlMatches: 'taxer.ua/[[:alpha:]][[:alpha:]]/my/finances/operations' }],
  });
});
