import { UploadFileResponse } from '@/components/profile/upload-zone'
import fetchClient from './fetch.client'
import { ApiUrl } from './string.util'

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
export const uploadFile2TmpfilesDotOrg = async (file: File) => {
    const body = new FormData()
    body.append('file', file)

    const ret = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: body,
    })
    return (await ret.json()).data.url.replace(
        'tmpfiles.org/',
        'tmpfiles.org/dl/'
    )
}

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
export const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file as File)

    try {
        const response = await fetchClient.postForm<UploadFileResponse>(
            `${ApiUrl()}/upload`,
            {
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )

        console.log('Image uploaded successfully')
        return response.avatar_url
    } catch (error) {
        console.error('Error uploading image:', error)
        throw error
    }
}

export const resolveFileUrl = async (url: string) => {
    if (url.startsWith('/static/')) {
        return `${ApiUrl()}${url.replace('/static/', '/dl/')}`
    }
    return url
}
