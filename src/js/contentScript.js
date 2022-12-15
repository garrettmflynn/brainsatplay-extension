const brainsatplayExtensionActivation = () => {

  const ids = [
    'brainsatplay-injection'
  ]

  const proxyId = `${ids[0]}-proxy`

  let ports = {}

  const id = chrome.runtime.id

  // Forward messages from injected scripts to the extension pages
  window.addEventListener('message', function(event) {
    const message = event.data;

    const isProxy = message.source === id
    if (event.source !== window) return;  // Only accept messages from the same frame
    if (typeof message !== 'object' || message === null || (!ids.includes(message.source) && !isProxy)) return; // Only accept messages that we know are ours

    if (isProxy) message.source = ids[0]

    // Relay-Based Commands
      let port = ports[message.source]
      if (!port) {
        port = ports[message.source] = chrome.runtime.connect({name: message.source});
        port.onMessage.addListener((message) => {
          window.postMessage({...message, source: 'brainsatplay-content-script-relay'}, '*')
        });
      }

      port.postMessage(message)
  });

  // Inject a script
  var script = document.createElement('script'); 
  script.id = proxyId
  script.src = chrome.runtime.getURL('js/devtools/injected.js');
  script.type = "module";

  script.setAttribute('data-version', '0.0.0')
  script.setAttribute('data-id', id)

  const el = document.head||document.documentElement
  el.appendChild(script);

  // window.postMessage({
  //   source: id,
  //   command: 'echo', // direct shortcut command
  //   origin: window.location.href
  // }, '*')
}

brainsatplayExtensionActivation()
