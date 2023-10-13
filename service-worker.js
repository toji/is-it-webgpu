// The service worker facilitates communication between the page and the extension action
// (The button.) When a page reports WebGPU usage the statistics are saved using the storage API
// for the lifetime of the tab.

function setStats(stats, tabId) {
  const insert = {};
  insert[`${tabId}`] = stats;
  chrome.storage.session.set(insert);

  chrome.action.enable(tabId);
  chrome.action.setIcon({ tabId, path: "media/webgpu32.png" });
  if (stats.devices > 0) {
    chrome.action.setBadgeText({ tabId, text: `${stats.devices}`});
  }
}

async function getStats(tabId) {
  const result = await chrome.storage.session.get(`${tabId}`);
  const stats = result[`${tabId}`];
  if (stats) {
    return stats;
  }
  return {
    adapters: 0,
    devices: 0,
    contexts: 0,
    usedRenderPass: false,
    usedComputePass: false,
  };
}

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`${tabId}`);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Responds to WebGPU events recorded for this tab
  switch(message.type) {
    case 'setStats':
      setStats(message.stats, sender.tab.id);
      break;
    case 'getStats': {
      getStats(message.tabId).then((stats) => {
        sendResponse(stats);
      });
      return true;
    }
    default:
      console.error(`Unknown message type: ${message.type}`);
  }
});