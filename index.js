import { AudioContext, mediaDevices, MediaStreamAudioSourceNode } from 'node-web-audio-api';
import initializeWamHost from '@webaudiomodules/sdk/src/initializeWamHost.js';

import './wam-polyfill.js';

// we need dynamic imports to have the mocks registered first
const { default: WAM } = await import('wam-community/dist/plugins/wimmics/stonephaser/index.js');

const audioContext = new AudioContext();
const [ hostGroupId ] = await initializeWamHost(audioContext);
// console.log(hostGroupId);

const instance = await WAM.createInstance(hostGroupId, audioContext);

const mediaStream = await mediaDevices.getUserMedia({ audio: true });
const input = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
input.connect(instance.audioNode).connect(audioContext.destination);
