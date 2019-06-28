console.log('Client Side javascript file is loaded')

fetch('http://localhost:3000/weather?address=Cleveland').then((resp) => {
    resp.json().then((data) => {
        if(data.errors) {
            return console.log('Errors ' + data.errors)
        }
        console.log(data.forecast)
    })
})