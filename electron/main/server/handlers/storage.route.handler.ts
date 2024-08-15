import { serveStatic } from '@hono/node-server/serve-static'
import { createRoute, z } from '@hono/zod-openapi'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { isDev } from '../../util/electron.util'
import { HonoApp } from '../hono.app'

export const useStorageRoute = (app: HonoApp) => {
    app.get(
        '/static/*',
        serveStatic({
            root: isDev() ? './' : './resources/',
        })
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/upload',
            tags: ['Upload'],
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            request: {
                body: {
                    content: {
                        'multipart/form-data': {
                            schema: z
                                .object({
                                    image_name: z.string().optional(),
                                    image: z
                                        .instanceof(File)
                                        .or(z.string())
                                        .openapi({
                                            type: 'string',
                                            format: 'binary',
                                        }),
                                })
                                .openapi({
                                    required: ['image'],
                                }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    content: {
                        'application/json': {
                            schema: z.object({
                                local_path: z.string(),
                                avatar_url: z.string(),
                            }),
                        },
                    },
                    description: 'Upload successful response',
                },
                400: {
                    content: {
                        'application/json': {
                            schema: z.object({
                                error: z.string(),
                            }),
                        },
                    },
                    description:
                        'Bad request response, such as missing file or incorrect file type',
                },
            },
        }),
        async (c) => {
            const formData = await c.req.formData()

            // Retrieve the uploaded file
            const image = formData.get('image') as File
            if (!image) {
                return c.json(
                    { error: 'Image file is required' },
                    StatusCodes.BAD_REQUEST
                )
            }

            // Verify the file is an image
            if (!image.type.startsWith('image/')) {
                return c.json(
                    { error: 'Uploaded file is not an image' },
                    StatusCodes.BAD_REQUEST
                )
            }

            // Extract the image extension from MIME type
            const mimeType = image.type // e.g., 'image/png'
            const extension = mimeType.split('/')[1] // e.g., 'png'

            // Handle the custom image name if provided
            let imageName = formData.get('image_name') as string | null
            if (imageName) {
                imageName = imageName.toString().trim()
                // Sanitize the filename to prevent security issues
                imageName = path.basename(imageName)
                // Append the extension if missing
                if (!path.extname(imageName)) {
                    imageName += `.${extension}`
                }
            } else {
                // Use the original filename from the uploaded file
                imageName = image.name
            }

            // Convert the image to a buffer
            const imageBuffer = await image.arrayBuffer()

            // Determine the storage directory based on the environment
            const storageDir = isDev()
                ? path.join(process.cwd(), 'static')
                : path.join(process.resourcesPath, 'static')

            // Ensure the storage directory exists
            await fs.promises.mkdir(storageDir, { recursive: true })

            // Define the full path for the image
            const imagePath = path.join(storageDir, imageName)

            // Write the image file to the storage directory
            await fs.promises.writeFile(imagePath, Buffer.from(imageBuffer))

            return c.json(
                {
                    local_path: imagePath,
                    avatar_url: `/static/${imageName}`,
                },
                StatusCodes.OK
            )
        }
    )
}

export default useStorageRoute
