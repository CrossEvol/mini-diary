import { beforeEach, describe, expect, it, MockedFunction, vi } from 'vitest'
import { execAsync } from './cmd.aux'
import { findFreePort, getConnectionsUsingPort, killPort } from './net.util'

vi.mock(import('./cmd.aux'), async (importOriginal) => {
    const mod = await importOriginal() // type is inferred
    return {
        ...mod,
        execAsync: vi.fn(),
    }
})

describe('getConnectionsUsingPort', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should parse netstat output correctly', async () => {
        ;(
            execAsync as MockedFunction<ReturnType<typeof vi.fn>>
        ).mockResolvedValueOnce({
            stdout: `
TCP    127.0.0.1:4444       0.0.0.0:0              LISTENING       1234
TCP    127.0.0.1:4444       192.168.1.10:54321     ESTABLISHED     5678
`,
            stderr: '',
        })
        const connections = await getConnectionsUsingPort(4444)

        expect(connections).toEqual([
            {
                protocol: 'TCP',
                localAddress: '127.0.0.1',
                localPort: 4444,
                remoteAddress: '0.0.0.0',
                remotePort: 0,
                state: 'LISTENING',
                pid: 1234,
            },
            {
                protocol: 'TCP',
                localAddress: '127.0.0.1',
                localPort: 4444,
                remoteAddress: '192.168.1.10',
                remotePort: 54321,
                state: 'ESTABLISHED',
                pid: 5678,
            },
        ])
    })
})

describe('killPort', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should kill processes using the given port', async () => {
        ;(execAsync as MockedFunction<ReturnType<typeof vi.fn>>)
            .mockResolvedValue({})
            .mockResolvedValueOnce({
                stdout: `
TCP    127.0.0.1:4444       0.0.0.0:0              LISTENING       1234
TCP    127.0.0.1:4444       192.168.1.10:54321     ESTABLISHED     5678
`,
                stderr: '',
            })
        const result = await killPort(4444)

        expect(execAsync).toHaveBeenCalledWith('taskkill /PID 1234 /F')
        expect(execAsync).toHaveBeenCalledWith('taskkill /PID 5678 /F')
        expect(result).toBe(true)
    })

    it('should return false if no connections are found', async () => {
        ;(
            execAsync as MockedFunction<ReturnType<typeof vi.fn>>
        ).mockResolvedValueOnce({ stdout: '', stderr: '' })

        const result = await killPort(4444)

        expect(result).toBe(false)
    })

    it('should return false if taskkill fails', async () => {
        const mockOutput = `
      TCP    127.0.0.1:4444       0.0.0.0:0              LISTENING       1234
    `

        ;(
            execAsync as MockedFunction<ReturnType<typeof vi.fn>>
        ).mockResolvedValueOnce({
            stdout: mockOutput,
            stderr: '',
        })
        ;(
            execAsync as MockedFunction<ReturnType<typeof vi.fn>>
        ).mockRejectedValueOnce(new Error('Taskkill failed'))

        const result = await killPort(4444)

        expect(result).toBe(false)
    })
})

describe('findFreePort', () => {
    it('should find a free port within the specified range multiple times', async () => {
        const iterations = 10 // Adjust the number of iterations as needed

        for (let i = 0; i < iterations; i++) {
            const result = await findFreePort(1024, 65535)
            expect(result).gte(1024)
            expect(result).lte(65535)
        }
    })
})
