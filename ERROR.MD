## ESM vs Commmonjs

```ts
Running seed command `ts-node --esm prisma/seed.ts` ...
D:\WEB-Code\my-electron\electron-vite-react-cp\prisma\seed.ts:1
import { PrismaClient } from '@prisma/client';
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

需要修改`tsconfig.json`

```ts
 "module": "CommonJS",
```

但是由于这是`vite`项目,这么做可能会导致别的bug或性能问题

所以最后只在`npx prisma db seed` 的时候这么操作

## Prisma

参考:<br/>

https://github.com/TasinIshmam/prisma-electron-test/tree/master  (官方`issues`提供的版本)<br/>

https://github.com/CrossEvol/electron-prisma-demo  (本人更新依赖的版本)<br/>

## can not preload css
```shell
Unable to preload CSS for file:///D:/WEB-Code/my-electron/mini-diary/release/0.0.1-snapshot/win-unpacked/resources/app.asar/dist/assets/index-BppIz9BB.css
Error: Unable to preload CSS for file:///D:/WEB-Code/my-electron/mini-diary/release/0.0.1-snapshot/win-unpacked/resources/app.asar/dist/assets/index-BppIz9BB.css
    at HTMLLinkElement.<anonymous> (file:///D:/WEB-Code/my-electron/mini-diary/release/0.0.1-snapshot/win-unpacked/resources/app.asar/dist/assets/test-B77mtunr.js:70:5558
```