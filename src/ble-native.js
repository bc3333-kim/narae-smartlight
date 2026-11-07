// 네이티브(Capacitor) 환경에서만 쓰는 BLE 어댑터. 웹 브라우저에서는 isNative=false 로 두고 앱이 Web Bluetooth 를 사용한다.
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

const SERVICE = '5f1a3a00-c1a2-4c0e-9c2e-9b3b6a1f0001';
const CMD     = '5f1a3a00-c1a2-4c0e-9c2e-9b3b6a1f0002';
const STATE   = '5f1a3a00-c1a2-4c0e-9c2e-9b3b6a1f0003';

let inited = false;
async function init() {
  if (inited) return;
  await BleClient.initialize();          // 권한 요청(블루투스/근처 기기) 포함
  inited = true;
}

// 주변의 Narae- 전등을 찾아 [{deviceId, name}] 로 반환
async function scan(ms = 4000) {
  await init();
  const found = new Map();
  await BleClient.requestLEScan({ services: [SERVICE] }, r => {
    const name = r.localName || (r.device && r.device.name) || '';
    if (/^Narae-/.test(name)) found.set(r.device.deviceId, { deviceId: r.device.deviceId, name, rssi: r.rssi });
  });
  await new Promise(res => setTimeout(res, ms));
  try { await BleClient.stopLEScan(); } catch (e) {}
  return [...found.values()];
}

async function connect(deviceId, onDisconnect) {
  await init();
  await BleClient.connect(deviceId, onDisconnect, { timeout: 10000 });
}
async function disconnect(deviceId) { try { await BleClient.disconnect(deviceId); } catch (e) {} }

const enc = new TextEncoder();
async function write(deviceId, obj) {
  const bytes = enc.encode(JSON.stringify(obj));
  await BleClient.write(deviceId, SERVICE, CMD, new DataView(bytes.buffer));
}
async function notify(deviceId, cb) { await BleClient.startNotifications(deviceId, SERVICE, STATE, cb); }
async function readState(deviceId) { return BleClient.read(deviceId, SERVICE, STATE); }
async function isEnabled() { await init(); return BleClient.isEnabled(); }

window.NativeBle = { isNative: Capacitor.isNativePlatform(), scan, connect, disconnect, write, notify, readState, isEnabled };
