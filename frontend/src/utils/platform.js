import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

// Backend server the installed APK talks to.
// Set at BUILD time via VITE_SERVER_URL (see frontend/.env.example) — point it
// at the server device's LAN IP for a physical phone, e.g.
//   VITE_SERVER_URL=http://192.168.0.42:8000
// Falls back to the Android emulator host (10.0.2.2 -> host's localhost:8000).
// Can also be overridden at runtime via localStorage 'custom_server_url'.
const DEFAULT_SERVER = import.meta.env.VITE_SERVER_URL || 'http://10.0.2.2:8000';

export const getApiBase = () => {
  const customServer = localStorage.getItem('custom_server_url') || DEFAULT_SERVER;
  return isNative() ? `${customServer}/api` : '/api';
};

export const getMediaBase = () => {
  const customServer = localStorage.getItem('custom_server_url') || DEFAULT_SERVER;
  return isNative() ? customServer : '';
};

export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${getMediaBase()}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Resolve a bundled static asset path (e.g. "images/cactus.jpg").
// On a native build the static images are served by the backend (Django serves
// /images/ in DEBUG); on the web they come from the Vite base path.
export const staticAsset = (path) => {
  const clean = path.replace(/^\//, '');
  if (isNative()) return `${getMediaBase()}/${clean}`;
  return `${import.meta.env.BASE_URL}${clean}`;
};
