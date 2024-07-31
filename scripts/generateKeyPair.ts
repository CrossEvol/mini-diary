import * as crypto from 'crypto'
import * as fs from 'fs/promises'
import { join } from 'path'

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
                        passphrase: 'your_passphrase',
                    }, // Replace with your desired passphrase
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

        await fs.writeFile(join(__dirname, 'public_key.pem'), publicKey)
        await fs.writeFile(join(__dirname, 'private_key.pem'), privateKey)

        console.log('RSA key pair generated and saved to files.')
    } catch (error) {
        console.error('Error generating RSA key pair:', error)
    }
}

generateRSAKeyPair()
