import 'vitest'

declare module 'net' {
  interface Server {
    listen: jest.Mock
    close: jest.Mock
    on: jest.Mock
  }
}
