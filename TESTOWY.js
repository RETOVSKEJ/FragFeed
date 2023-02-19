const mongoose = require('mongoose')
const Test = require('./TESTOWY2')
mongoose.set('strictQuery', false);
mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1/testowaDB',  
() => console.log("connected"), 
e => console.error(e))

// const user = Test.find({name: 'areeej'}).then(v => console.log(v)).catch(e => console.log(e))
// console.log(user)

// async function run(){
//     console.time('1')
//     await Test.create({
//         name: "starye",
//         age: 15
//     })
//     console.log('created')
//     console.timeEnd('1')
//     console.time('2')
//     Test.create({
//         name: "amacie",
//         age: 15
//     })
//     console.log('created 2')
//     console.timeEnd('2')
// }

// const regex = new RegExp('[\w\d\s]', 'g')

// // deleteMany()
// async function deleteMany(){
//     await Test.deleteMany({
//         name : /[\w\d\s]/g
//     })
// }

// const arr = []
// const str = 'eeeas'.split()
// console.log(Array.isArray(str) && arr.length == 0)
// console.log(str)


// const obj = {name: 'starye'}

// async function testWhere(){
//     const test = await Test.exists(obj)
//     console.log(test)
//     return 5
// }

// // async function testAsync(){
// //     const info = await fetch('https://jsonplaceholder.typicode.com/todos/1')
// //     console.log(info)
// // }

// // async function testAsync2(){
// //     console.log('async2')
// // }

// (async () => {
//     await run()
//     console.log(testWhere().then(v => console.log(v)))
// }) ();

// async function testNull2(){
//     const user = await Test.findOne({ name: "starye"}).maxTimeMS(5000).exec()
//     await console.log("EEEE")
//     await console.log(user)
// }

// async function testNull(){
//     const user = await Test.find({ name: "starye"}).exec()
//     await console.log("EE@@@")
//     await console.log(user)
// }


// testowa()
// async function testowa(){
//     console.log('1TEST')
//     testNull()
//     console.log('2TEST')
//     testNull2()
//     console.log('3TEST')
// }


// let str1 = 'arekrk'
// console.log(str1.length);

// const objX = {
//     objXX: {
//         nazwa: {
//             age: 15
//         }
//     }
// }

// const testStr = 'nazwa'

// console.log(objX.objXX[testStr].age)

async function TESTING(){
    return await Test.findOne({name: "starye"})
}

const user = TESTING()
lognijUsera()
async function lognijUsera(){
    console.log(await user)
}

// let x = 5 ?? 3;
// console.log(x)
// x ||= 3;
// y ||= 3;
// console.log(x)
// x &&= 4;
// z &&= 5;
// console.log(y,z)
// console.log(x)

(async function(){
if (user == null) {
    console.log("sema")
}})();

const str = "string"
function changeStr(str)
{
    str += "eeee"
}

changeStr(str)
console.log(str)


const czlowiek = {
    name: 'arek'
}
function changeObj(obj)
{
    obj.name ="darek"
    obj = "dupa"
}
changeObj(czlowiek)
console.log(czlowiek.name)
console.log(czlowiek)