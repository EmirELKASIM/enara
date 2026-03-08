import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.enara',
  appName: 'enara',
  webDir: 'dist/apps/enara/browser',
  android: {
    allowMixedContent: true
  }
};

export default config;
