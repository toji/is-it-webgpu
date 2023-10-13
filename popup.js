// Whenever the popup is opened, get the stats for the current tab and render them.
chrome.tabs.query({'active': true, 'currentWindow':true}, (tabs) => {
  console.log('Got tab:', tabs);
  chrome.runtime.sendMessage({'type':'getStats', 'tabId': tabs[0].id}, (stats) => {
    if (stats.devices > 0) {
      header.innerHTML = `<img src='media/webgpu24.png'></img>Page uses WebGPU`
    } else if (stats.adapters > 0) {
      header.innerHTML = `<img src='media/webgpu24-disabled.png'></img>Page checked WebGPU support`
    }

    adapters.innerText = stats.adapters;
    devices.innerText = stats.devices;
    contexts.innerText = stats.contexts;

    renderPass.innerHTML = stats.usedRenderPass ? '✔️' : '❌';
    computePass.innerHTML = stats.usedComputePass ? '✔️' : '❌';
  })
});