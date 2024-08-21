import * as crypto from 'crypto'
import * as fs from 'fs/promises'
import { dirname, join } from 'path'

async function generateRSAKeyPair() {
  try {
    const { publicKey, privateKey } = await new Promise<{
      publicKey: string
      privateKey: string
    }>((resolve, reject) => {
      crypto.generateKeyPair(
        'rsa',
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'your_passphrase'
          } // Replace with your desired passphrase
        },
        (err, publicKey, privateKey) => {
          if (err) {
            reject(err)
          } else {
            resolve({ publicKey, privateKey })
          }
        }
      )
    })

    const publicPath = join(__dirname, 'public.pem')
    const privatePath = join(__dirname, 'private.key')

    await fs.writeFile(publicPath, publicKey)
    await fs.writeFile(privatePath, privateKey)

    console.log('RSA key pair generated and saved to files.')

    // Determine the parent directory
    const parentDir = dirname(__dirname)

    // Define destination paths
    const publicDest = join(parentDir, 'public.pem')
    const privateDest = join(parentDir, 'private.key')

    // Check if files exist in the parent directory
    const publicExists = await fileExists(publicDest)
    const privateExists = await fileExists(privateDest)

    if (!publicExists && !privateExists) {
      await fs.rename(publicPath, publicDest)
      await fs.rename(privatePath, privateDest)
      console.log('Files moved to the parent directory.')
    } else {
      console.log(
        'Files already exist in the parent directory. No files were moved.'
      )
    }
  } catch (error) {
    console.error('Error generating RSA key pair:', error)
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

generateRSAKeyPair()
