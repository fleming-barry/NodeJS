// const square = function(x) {
//     return x * x;
// }

// const square = x => {
//   return x * x;
// };

// const square = x => x * x;

// console.log(square(3));

const event = {
    name: 'Birthday Party',
    guestList: ['Barry', 'Katie','Mike'],
    printGuestList() {
        console.log('Guest List for ' + this.name)

        this.guestList.forEach((g) => {
            console.log(g + ' is attending ' + this.name)
        })
    }
}


event.printGuestList()