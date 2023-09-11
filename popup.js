// Whenever the popup is opened, get the stats for the current tab and render them.
chrome.tabs.query({'active': true, 'currentWindow':true}, (tabs) => {
  console.log('Got tab:', tabs);
  chrome.runtime.sendMessage({'type':'getStats', 'tabId': tabs[0].id}, (stats) => {
    adapters.innerText = stats.adapters;
    devices.innerText = stats.devices;
    contexts.innerText = stats.contexts;

    renderPass.innerHTML = stats.usedRenderPass ? '✅' : '❎';
    computePass.innerHTML = stats.usedComputePass ? '✅' : '❎';
  })
});