import { readFileSync } from 'fs'
import { join } from 'path'
import { test, expect } from 'vitest'

test('whether split the md content by \n or not', () => {
  const file = readFileSync(join(__dirname, '1.md'), {
    encoding: 'utf-8'
  })
  expect(file.split('\n').length).toBe(9)
  file.split('\n').forEach((s) => console.log(s))
})
