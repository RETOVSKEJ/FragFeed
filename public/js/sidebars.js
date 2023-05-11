const menu = document.querySelector('.menu')
const menuCheck = document.getElementById('menu-button')
const menuLabel = document.querySelector('.menu-container')

/// HAMBURGER CLICKS ///
window.addEventListener('click', function (ev) {
	if (window.innerWidth > 621) return
	if (menu.contains(ev.target)) {
		// Clicked in box  ==  leave menu open
	} else {
		// Clicked outside the box  == close menu
		if (ev.target.tagName !== 'LABEL') {
			if (ev.target.tagName !== 'INPUT') {
				menuCheck.checked = false
			} else if (ev.target.id === 'search') {
				// close menu even when clicked on search
				menuCheck.checked = false
			}
		}
	}
})

// document.addEventListener('click', (ev) => {
// 	if (window.innerWidth > 621) return
// 	if (ev.target.tagName === 'LABEL' || menuCheck.checked == false) {
// 		return ev.stopPropagation()
// 	}
// 	if (!menu.contains(ev.target) && menuCheck.checked) console.log('test')
// 	// if (!menu.contains(ev.target)) menuCheck.checked = false

// 	// if (menu.contains(ev.target) || ev.target.tagName === 'LABEL') {
// 	// 	// The click occurred inside the element
// 	// 	console.log('test1')
// 	// 	return
// 	// }
// 	// console.log('test2')

// 	// if (ev.target.tagName !== 'LABEL') {
// 	// 	if (menuCheck.checked) {
// 	// 		ev.preventDefault()
// 	// 		return (menuCheck.checked = false)
// 	// 	}
// 	// 	return // clicked on label, do nothing
// 	// }

// 	// The click occurred outside the element
// })

/// STICKY SIDEBARS ///
document.body.onscroll = () => {
	if (window.innerWidth < 620) {
		return
	}
	const HOT_WRAPPER_HEIGHT = hotPostWrapper.offsetHeight
	let WRAPPER_MARGIN_TOP = 32
	if (window.innerWidth < 1041 && window.innerWidth > 620) {
		// 1041 is media query equivalent
		WRAPPER_MARGIN_TOP = 85 // top sidebar height + margin
	}
	const ADDITIONAL_MARGIN_BOTTOM = 4
	const pos =
		window.scrollY +
		window.innerHeight -
		NAVBAR_HEIGHT -
		WRAPPER_MARGIN_TOP -
		ADDITIONAL_MARGIN_BOTTOM
	if (pos > HOT_WRAPPER_HEIGHT) {
		hotPostWrapper.style.marginTop = `${pos - HOT_WRAPPER_HEIGHT}px`
	} else {
		hotPostWrapper.style.marginTop = '0px'
	}
}
