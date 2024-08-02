import localforage from 'localforage'
import { useCallback } from 'react'

const _saveToForage = async <K, V>(key: K, data: V) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    await localforage.setItem<V>(keyString, data)
}

const _loadFromForage = async <K, V>(key: K) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    const storageString = await localforage.getItem<V>(keyString)
    return storageString ?? undefined
}

const _removeFromForage = async (key: any) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    await localforage.removeItem(keyString)
}

const useLocalForage = () => {
    const saveToForage = useCallback(async <K, V>(key: K, data: V) => {
        await _saveToForage<K, V>(key, data)
    }, [])

    const loadFromForage = useCallback(async <K, V>(key: K) => {
        return await _loadFromForage<K, V>(key)
    }, [])

    const removeFromForage = useCallback(async (key: any) => {
        await _removeFromForage(key)
    }, [])

    return { saveToForage, loadFromForage, removeFromForage }
}

export default useLocalForage
