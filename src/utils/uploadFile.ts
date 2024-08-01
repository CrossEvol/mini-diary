// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
export const uploadFile = async (file: File) => {
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
