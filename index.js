import fs from 'node:fs';
import { URL } from 'url'
import { AudioContext, GainNode, AudioParam, AudioWorkletNode, mediaDevices, MediaStreamAudioSourceNode } from 'node-web-audio-api';
import initializeWamHost from '@webaudiomodules/sdk/src/initializeWamHost.js';

// mock everything we can / need...
globalThis.GainNode = GainNode;
globalThis.AudioParam = AudioParam;
globalThis.AudioWorkletNode = AudioWorkletNode;
globalThis.window = { URL };
globalThis.HTMLElement = class {};
globalThis.customElements = { define: function() {} };
globalThis.fetch = (pathname) => {
  pathname = pathname.replace(/^file:\/\//, '');

  return new Promise(resolve => {
    if (!fs.existsSync(pathname)) {
      resolve({
        ok: false,
        msg: `file ${pathname} not found`,
      });
    } else {
      const buffer = fs.readFileSync(pathname);

      resolve({
        ok: true,
        text: () => buffer.toString(),
        json: () => JSON.parse(buffer.toString()),
        arrayBuffer: () => buffer,
      });
    }
  });
}

// we need dynamic imports to have the mocks registered first
const { default: WAM } = await import('wam-community/dist/plugins/wimmics/stonephaser/index.js');

const audioContext = new AudioContext();
const [ hostGroupId ] = await initializeWamHost(audioContext);
console.log(hostGroupId);

const instance = await WAM.createInstance(hostGroupId, audioContext);
console.log(instance);

const mediaStream = await mediaDevices.getUserMedia({ audio: true });
const input = new MediaStreamAudioSourceNode(audioContext, { mediaStream });

input.connect(instance.audioNode);
instance.audioNode.connect(audioContext.destination);

