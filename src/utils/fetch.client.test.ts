import { test, expect } from 'vitest'
import fetchClient from './fetch.client'
import { HttpBinGetResult, HTTPBinPostResult } from './httpbin.type'

test('get', async () => {
  const result = await fetchClient.get<HttpBinGetResult>(
    'https://httpbin.org/get'
  )
  expect(result).toBeDefined()
  expect(result).haveOwnProperty('args')
  expect(result).haveOwnProperty('headers')
  expect(result).haveOwnProperty('origin')
  expect(result).haveOwnProperty('url')
})

test('post', async () => {
  const result = await fetchClient.post<HTTPBinPostResult>(
    'https://httpbin.org/post'
  )
  expect(result).toBeDefined()
  expect(result).haveOwnProperty('args')
  expect(result).haveOwnProperty('data')
  expect(result).haveOwnProperty('files')
  expect(result).haveOwnProperty('form')
  expect(result).haveOwnProperty('headers')
  expect(result).haveOwnProperty('json')
  expect(result).haveOwnProperty('origin')
  expect(result).haveOwnProperty('url')
})
