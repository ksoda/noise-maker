/* eslint-env browser */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
            .register('sw.js')
            .then(function() { console.log('Service Worker Registered'); });
}
const logger = console.debug;
const noise = {
  init: function() {
    this.context = new AudioContext();
    this.connect(this.mkBrown());
    this.suspend();
    this.bind();
  },
  bind: function () {
    document.querySelector('#play').onchange = this.updateNoise.bind(this);
  },
  connect: function(source) {
    // const g = this.context.createGain();
    // source.connect(g);
    // g.connect(this.context.destination);
    source.connect(this.context.destination);
  },
  mkBrown: function() {
    const frameCount = Math.pow(2, 12);
    const node = this.context.createScriptProcessor(frameCount, 1, 1);
    node.onaudioprocess = onProcess;
    return node;

    function onProcess(e) {
      const nowBuffering = e.outputBuffer.getChannelData(0);
      let lastPower = 0.0;
      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        lastPower = (lastPower + (0.02 * white)) / 1.02; // -12dB/octave
        nowBuffering[i] = 2 * lastPower; // compensate for gain
      }
    }
  },
  suspend: function() {
    this.context.suspend()
  },
  resume: function() {
    this.context.resume()
  },
  updateNoise: function (e){
    logger(e.target.checked);
    if(e.target.checked) this.resume();
    else this.suspend();
  }
}

window.onload = noise.init.bind(noise);
