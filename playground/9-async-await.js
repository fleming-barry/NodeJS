const add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return rej('Numbers must not be non-negative')
            }
            res(a + b)
        }, 2000)
    })
}

const doWork = async () => {
    const sum = await add(1, -99)
    const sum2 = await add(sum, 50)
    const sum3 = await add(sum2, 23)
    return sum3
}

doWork().then((result) => {
    console.log('result', result)
}).catch((e) => {
    console.log('error', e)
})