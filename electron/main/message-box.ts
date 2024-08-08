import { BrowserWindow, dialog, MessageBoxOptions } from 'electron'
import path from 'node:path'

export function showMessageBox(mainWindow: BrowserWindow) {
    const options: MessageBoxOptions = {
        type: 'question',
        buttons: ['Cancel', 'Yes, Please', 'No, Thanks'],
        defaultId: 2,
        title: 'Question',
        message: `
<!DOCTYPE html>
<html>
<head>
  <title>Electron App</title>
</head>
<body>
  <h1>Welcome to Electron</h1>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
  <title>Electron App</title>
</head>
<body>
  <h1>Welcome to Electron</h1>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
  <title>Electron App</title>
</head>
<body>
  <h1>Welcome to Electron</h1>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
  <title>Electron App</title>
</head>
<body>
  <h1>Welcome to Electron</h1>
</body>
</html>

        `,
        detail: 'Doing this will perform the action. Are you sure you want to proceed?',
        checkboxLabel: 'Remember my choice',
        checkboxChecked: false,
        icon: path.join(__dirname, 'icon.png'), // Ensure you have an icon file at this path
    }

    dialog.showMessageBox(mainWindow, options).then((result) => {
        console.log('Button clicked:', result.response)
        console.log('Checkbox checked:', result.checkboxChecked)
        if (result.response === 1) {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                buttons: ['OK'],
                title: 'Info',
                message: 'You chose to proceed!',
            })
        } else {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                buttons: ['OK'],
                title: 'Info',
                message: 'You chose not to proceed!',
            })
        }
    })
}
