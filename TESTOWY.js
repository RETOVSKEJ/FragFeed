const arr = [1,3,5]
const newarr = arr.reverse()

console.log(arr, newarr);



console.log(process.env.PORT)

function testArgumentow(a,b,c){
    console.log(arguments)
}

const elo = () => {let name = "marek"; console.log(this.name)}
function eloo(){
    let name = "darek";
    console.log(this.name)
}

console.log(testArgumentow(5,32,2))

const obj = {
    name: "arek",
    decl() {console.log(this.name)},
    arrow: () => {console.log(this.name)}
}

function Klasa(){
    // this.globalnaZmienna = "Antoni";
    // this.globalnaFunkcja = () => {
    //     console.log("Nie definiowac kodu z this. w klasie!")
    // }
    
    let test = "rfrf"
    let name = "dominik"
    let obj = {
        property: 'eee',
        metoda() {
            let zmienna = 'ee';
        }
    }

    function decl(){
        console.log(this.globalnaZmienna)
        console.log(this.name)
    }
    const arrow = () => {
        let hidden = 12;
        console.log(this.globalnaZmienna)
        console.log(name)
        console.log(obj.metoda.name)
        console.log(obj.metoda.zmienna);
    }

    return {
        arrow,
    }
    
}

const instancja = Klasa()
instancja.arrow() //> wynik  == gdy zwracam obiekt z funkcjami (Module pattern)
// instancja()  //> wynik ==  gdy zwracam bezposrednio pojedyncza inner funkcje
console.log('ZMIENNA' + instancja.hidden) // undefined 
console.log('ZMIENNAAA' + Klasa.test)   // undefined

elo()
eloo()

obj.decl()
obj.arrow()


// console.log(globalnaZmienna)
// globalnaFunkcja()

function Clasa(){

    this.jakasFunkcja = () => {
        console.log("eee" + this.dupa + nazwa)
    }
    this.dupa = "dupa"
    let nazwa = 'nazwa';
    // this.innaFunkcja(){
    //     console.log("deklaracja")
    // }

    // return {
    //     nazwa,
    //     jakasFunkcja,
    //     dupa: this.dupa
    // }
}

Clasa.prototype.szczekaj = function(){
    console.log("Hauhau", this.dupa, this.nazwa)
}

const clasa = new Clasa();
// clasa.innaFunkcja
console.log(clasa.nazwa, clasa.dupa)
clasa.szczekaj()
clasa.jakasFunkcja()


hoistingTest()


function hoistingTest(){
    console.log('eeeearafs')
}

{
    function hoistingTest2(){
        console.log('eeeearafs')
    }
}

const testobj = {
    name: "jacek",
    age: 15
}

console.log(typeof(Error))
console.log(typeof(new Error))

try {
    throw Error("I'm Evil")
    console.log("You'll never reach to me", 123465)
  } catch (e) {
    console.log(e); // I'm Evil
  }

  console.log("Dalszy kod")


const str = "hell"
console.log(str.concat("deee"))
console.log(str.padEnd(2, "eeeeeee")) // maxymalna dlugosc stringa (jesli mniejsza, to nie doda paddingu)

console.log(str.match('de|le|ke|el'))
console.log(str.search('ll')) 

for(let i = 0, e = 35; i != 15; i++, e++){
    console.log(i,e)
}

const fibi = (n) => {
    let n1 = 0, n2 = 1, nextTerm;
    for(let i = 0; i < n; i++)
    { 
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm
    }
    return nextTerm
}

let a = 5;
let b = 3;
[a,b] = [b,a]
console.log(a,b)

console.log(fibi(5))

console.info('1')
{
    setTimeout(() => console.log("timeout1"),5)
    setTimeout(() => console.log("timeout4"), 0)
    console.log('2')
}
console.info('3')

async function Kolejnosc(){
    console.log("1")
    setTimeout(async () =>await console.log("2"), 0)
    console.log('3')
}

Kolejnosc()