import { build } from 'esbuild';
await build({ entryPoints: ['src/ble-native.js'], bundle: true, format: 'iife', minify: true, outfile: 'www/ble-native.js', target: 'es2020' });
console.log('ble-native.js 번들 완료');
