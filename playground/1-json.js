const fs = require('fs')
// const book = {
//     title: 'Ego is the Enemy',
//     author: 'Ryan Holiday'
// }

// const bookJSON = JSON.stringify(book)
// fs.writeFileSync('1-json.json', bookJSON)

const dataBuffer = fs.readFileSync('1-json.json')
const dataJSON = dataBuffer.toString()
var data = JSON.parse(dataJSON)
data.name = 'Barry'
data.age = 33

const bookJSON = JSON.stringify(data);
fs.writeFileSync('1-json.json', bookJSON)

console.log(data.name)

