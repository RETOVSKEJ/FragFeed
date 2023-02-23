const myEvent = new Event('myEvent')

document.body.addEventListener('myEvent', (ev) => {
	console.log(ev)
})

document.body.dispatchEvent(myEvent)

const myCustomEvent = new CustomEvent('MyCustomEvent', { detail: 'elo' })

document.addEventListener('MyCustomEvent', (ev) => {
	console.log(ev)
})

document.dispatchEvent(myCustomEvent)
