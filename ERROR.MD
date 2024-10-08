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

can be resolved by not dynamic importing the IpcButton 

## localStorage.port will lost in release mode after the below code trigger though it has no problem in dev mode
`src/components/todos/todo-create-or-search-input.tsx`
```tsx
<InputBase
                    sx={{ ml: 1, flex: 1 }}
                    value={text}
                    onKeyUp={async (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            setPickedDay(DATE_1999_09_09)
                            setSearchText(text)
                            await resetTodosPage(10)
                        }
                    }}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                    placeholder={'Search todo ...'}
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
```

`src/main.tsx`
```tsx
console.log('完全重新渲染了...')
if (!isDevelopment) {
    console.log('我又执行了...')
    localStorage.removeItem('port')
}

```

by debug info, only once the Entry will trigger full page reload. and I do not know why

solve it by prevent form submit or set elementType exclude <form/>
`prevent submit`
```tsx
<Paper
    onSubmit={(e) => {
        e.preventDefault()
    }}
    component='form'
    sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    }}
>
```

`change <Paper/> sub component type`
```tsx
<Paper
    component='div'
    sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    }}
>
```

## TypeError: styled_default is not a function
this error seems unpredictable

[issue](https://github.com/mui/material-ui/issues/36515)
`desc: `The Popper runs well and does not complain about styled not being a function when bundled with Webpack - this leads me to believe it's a problem on Vite's side, in their bundling logic, not in your project.
`one solution:`
```tsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/icons-material',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
});
```

## build error cause by generate vite.config.d.ts
```shell
error TS6305: Output file 'D:/WEB-Code/my-electron/mini-diary-bak/vite.config.d.ts' has not been built from source file 'D:/WEB-Code/my-electron/mini-diary-bak/vite.config.ts'.
  The file is in the program because:
    Matched by include pattern '**/*.ts' in 'D:/WEB-Code/my-electron/mini-diary-bak/tsconfig.json'

  tsconfig.json:33:5
    33     "**/*.ts",
           ~~~~~~~~~
    File is matched by include pattern specified here.


Found 1 error.

 ELIFECYCLE  Command failed with exit code 2.
```

`tsconfig.node.json`
from `"include": ["vite.config.ts", "package.json","jest.config.js"]`
to `"include": ["package.json","jest.config.js"]`

## ESLint couldn't determine the plugin uniquely
Sometimes, if you integrate, you might see an error similar to this

```shell
Oops! Something went wrong! :(

ESLint: 8.25.0

ESLint couldn't determine the plugin "react" uniquely.

- /Users/paul.ang/tw-code/cards-page/node_modules/.pnpm/eslint-plugin-react@7.31.10_eslint@8.25.0/node_modules/eslint-plugin-react/index.js (loaded in ".eslintrc.js » plugin:react/jsx-runtime")
- /Users/paul.ang/tw-code/cards-page/node_modules/.pnpm/@wise+eslint-config@8.0.1_@babel+plugin-sy_afooenpggdpbpvboeoaxgxg2zu/node_modules/@wise/eslint-config/node_modules/eslint-plugin-react/index.js (loaded in ".eslintrc.js » @wise/eslint-config » plugin:react/jsx-runtime")

Please remove the "plugins" setting from either config or remove either plugin installation.

If you still can't figure out the problem, please stop by https://eslint.org/chat/help to chat with the team.
```
Most of the time, removing the offending plugin (in this case, plugin:react/jsx-runtime) in your eslintrc file should solve the issue.

What this means is that the said plugin is already imported in the configs. Importing them again will cause the issue.