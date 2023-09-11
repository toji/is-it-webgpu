//const webgpuStats = new Map();

// Wrap in an onInstalled callback in order to avoid unnecessary work
// every time the background script is run
chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();
});

function setStats(stats, tabId) {
  //webgpuStats.set(tabId, stats);
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