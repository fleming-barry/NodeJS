const {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit, 
    add
} = require('../src/math')

test('Calculate total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const cel = fahrenheitToCelsius(32)
    expect(cel).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const fahren = celsiusToFahrenheit(0)
    expect(fahren).toBe(32)
})

// test('Async test demo', (done) => {
//     setTimeout(() => { 
//         expect(1).toBe(2)
//         done()
//     }, 2000)
    
// })

test('Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        done()

     })    
})

test('Should add two number async/await', async () => {
    const sum = await add(11, 22)   
    expect(sum).toBe(33)
})