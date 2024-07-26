import { _electron as electron, expect, test } from '@playwright/test'

test('homepage has title and links to intro page', async () => {
    const app = await electron.launch({ args: ['.', '--no-sandbox'] })
    const isPackaged = await app.evaluate(async ({ app }) => {
        // This runs in Electron's main process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.isPackaged
    })

    expect(isPackaged).toBe(false)

    const page = await app.firstWindow()

    // const inputOne = page
    //     .locator('div')
    //     .filter({
    //         hasText: /^Pattern 1: Renderer to main \(one-way\)Message: Send$/,
    //     })
    //     .locator('#title')
    // expect((await inputOne.textContent())!.length).toBe(0)
    // const inputTwo = page.locator('#title').nth(1)
    // expect((await inputTwo.textContent())!.length).toBe(0)

    // const sendBtn = page.getByRole('button', { name: 'Send', exact: true })
    // await sendBtn.click()
    // const openFileBtn = page.getByText('Open a File')
    // await openFileBtn.click()

    // const sendTwoWayMsgBtn = page.getByRole('button', {
    //     name: 'Send Two-way Message',
    //     exact: true,
    // })

    // await sendTwoWayMsgBtn.click()

    // const getDbMsgBtn = page.getByRole('button', {
    //     name: 'Get message from DB',
    // })
    // await getDbMsgBtn.click()
    // const getAllUsersBtn = page.getByRole('button', { name: 'Get all users' })
    // await getAllUsersBtn.click()
    // const addUserBtn = page.getByRole('button', { name: 'Add a user' })
    // await addUserBtn.click()

    expect(await page.title()).toBe('Electron + Vite + React')
    await page.screenshot({ path: 'e2e/screenshots/example.png' })
})
