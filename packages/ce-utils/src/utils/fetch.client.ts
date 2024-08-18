enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

export const fetchGet = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, { ...options, method: HttpMethod.GET })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

export const fetchPost = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

export const fetchPostForm = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    // Omitting 'Content-Type' header as fetch automatically sets it for FormData
    const response = await fetch(url, {
        ...options,
        method: HttpMethod.POST,
        headers: { ...options?.headers },
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

export const fetchPut = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

export const fetchDelete = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        method: HttpMethod.DELETE,
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

export const fetchPatch = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        method: HttpMethod.PATCH,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}
