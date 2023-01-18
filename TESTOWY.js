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