import { Config } from 'ce-shard'

// Default configuration
export const defaultConfig: Config = {
  ui: {
    theme: 'system',
    'main-window': {
      width: 1000,
      height: 800,
      resizable: true,
      'hide-menu': false
    },
    'sub-window': {
      width: 1000,
      height: 800,
      resizable: true,
      'hide-menu': true
    }
  },
  storage: {
    log: { dir: 'logs' },
    secret: {
      'pri-key': 'private.key',
      'pub-pem': 'public.pem'
    },
    database: 'sqlite.db',
    images: '/static'
  },
  system: {
    'auto-update': false,
    'enable-notify': true
  },
  server: {
    fixed: false,
    port: 4444
  }
}
