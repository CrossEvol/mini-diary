import { createHello } from "../utils/hello"

describe('init', () => {
    it('hello', () => {
        const helloMsg:string = createHello()
        console.log(helloMsg)
    })
})
