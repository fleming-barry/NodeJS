// setTimeout(() => {
//   console.log('Two seconds are up');
// }, 2000);

// const names = ['Barry', 'Jodi', 'Jess'];
// const shortName = names.filter(name => {
//   return name.length <= 4;
// });

// const geoCode = (address, callback) => {
//   setTimeout(() => {
//     const data = {
//       longitude: 0,
//       latitude: 0
//     };
//     callback(data)
//   }, 2000);
// };

// geoCode('Philly', (data) => {
//     console.log(data);
// });

const add = (x, y, callback) => {
    setTimeout(() => {
        callback(x + y)
    },2000)
}

add(1, 4, (sum) => {
    console.log(sum) // Should print: 5
})

