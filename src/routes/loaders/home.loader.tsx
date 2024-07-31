export function sleep(n: number = 500) {
    return new Promise((r) => setTimeout(r, n))
}

// Home
export interface HomeLoaderData {
    date: string
}

export async function homeLoader(): Promise<HomeLoaderData> {
    await sleep()
    return {
        date: new Date().toISOString(),
    }
}
