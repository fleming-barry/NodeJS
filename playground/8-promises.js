const doWorkPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve([1, 2, 3, 4])
        reject('This broke')
    }, 2000)
})

doWorkPromise.then((data) => {
    console.log('Success', data)
}).catch((err) => {
    console.log('Error!', err)
})