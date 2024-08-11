import * as fs from 'fs-extra'
import * as path from 'path'

// Define the source and destination directories
const sourceDir = path.join(__dirname, '..', 'electron/main/shared')
const destDirs = [
    path.join(__dirname, '..', 'electron/preload/shared'),
    path.join(__dirname, '..', 'electron/preload-date-picker/shared'),
    path.join(__dirname, '..', 'src/shared'),
    path.join(__dirname, '..', 'pages/date-picker/src/shared'),
    path.join(__dirname, '..', 'pages/imports-diff-box/src/shared'),
]

// Function to copy files recursively
const copyFilesRecursively = async (src: string, dest: string) => {
    try {
        await fs.copy(src, dest, { recursive: true, overwrite: true })
        console.log(`Copied from ${src} to ${dest}`)
    } catch (err) {
        console.error(`Error copying from ${src} to ${dest}:`, err)
    }
}

// Copy files to all destination directories
const copyToAllDestinations = async () => {
    for (const dest of destDirs) {
        await copyFilesRecursively(sourceDir, dest)
    }
}

const main = () => {
    // Run the copy operation
    copyToAllDestinations()
        .then(() => {
            console.log('All files copied successfully.')
        })
        .catch((err) => {
            console.error('Error during file copy:', err)
        })
}

main()
