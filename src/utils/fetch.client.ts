enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
}

async function get<T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...options, method: HttpMethod.GET })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

async function post<T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...options, method: HttpMethod.POST })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

async function put<T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...options, method: HttpMethod.PUT })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

async function delete0<T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...options, method: HttpMethod.DELETE })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
}

async function patch<T>(
    url: string | URL | globalThis.Request,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...options, method: HttpMethod.PATCH })
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
