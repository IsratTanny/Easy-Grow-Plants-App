import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

// Defaults to 10.0.2.2 (Android Emulator host IP) or localhost
const DEFAULT_SERVER = 'http://10.0.2.2:8000';

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
