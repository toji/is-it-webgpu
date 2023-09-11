// Replaces several WebGPU entry points with a function that records the method's use for the
// extension before forwarding the call unchanged to the native method.
(() => {
  function notifyExtension(message) {
    document.documentElement.dispatchEvent(new CustomEvent('extwebgpucheck', { detail: { message } }));
  }

  if (navigator.gpu) {
    const originalRequestAdapter = navigator.gpu.requestAdapter;
    navigator.gpu.requestAdapter = function (...args) {
      notifyExtension('adapter');
      return originalRequestAdapter.apply(this, args);
    }

    const originalRequestDevice = GPUAdapter.prototype.requestDevice;
    GPUAdapter.prototype.requestDevice = function (...args) {
      notifyExtension('device');
      return originalRequestDevice.apply(this, args);
    }

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) {
      if (args[0] == 'webgpu') {
        notifyExtension('context');
      }
      return originalGetContext.apply(this, args);
    }

    const originalBeginRenderPass = GPUCommandEncoder.prototype.beginRenderPass;
    GPUCommandEncoder.prototype.beginRenderPass = function (...args) {
      notifyExtension('renderPass');
      // Only need to observe the first call
      GPUCommandEncoder.prototype.beginRenderPass = originalBeginRenderPass;
      return originalBeginRenderPass.apply(this, args);
    }

    const originalBeginComputePass = GPUCommandEncoder.prototype.beginComputePass;
    GPUCommandEncoder.prototype.beginComputePass = function (...args) {
      notifyExtension('computePass');
      // Only need to observe the first call
      GPUCommandEncoder.prototype.beginComputePass = originalBeginComputePass;
      return originalBeginComputePass.apply(this, args);
    }
  }
})();


