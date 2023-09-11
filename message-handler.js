const webgpuStats = {
  adapters: 0,
  devices: 0,
  contexts: 0,
  usedRenderPass: false,
  usedComputePass: false,
};

document.documentElement.addEventListener('extwebgpucheck', (e) => {
  // Listens for any WebGPU check events raised from webgpu-watcher.js, which
  // runs in the MAIN world in order to capture those calls but can't
  // communicate with the extension service worker.
  switch(e.detail.message) {
    case 'adapter': webgpuStats.adapters++; break;
    case 'device': webgpuStats.devices++; break;
    case 'context': webgpuStats.contexts++; break;
    case 'renderPass': webgpuStats.usedRenderPass = true; break;
    case 'computePass': webgpuStats.usedComputePass = true; break;
    default: console.error('Unknown message type:', e);
  }

  chrome.runtime.sendMessage({ type: 'setStats', stats: webgpuStats });
});