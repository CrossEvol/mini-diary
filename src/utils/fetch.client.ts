enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

const get = async <T>(
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

const post = async <T>(
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

const put = async <T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(url, { ...options, method: HttpMethod.PUT })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

const delete0 = async <T>(
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

const patch = async <T>(
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

export default {
    get,
    post,
    put,
    delete: delete0,
    patch,
}
