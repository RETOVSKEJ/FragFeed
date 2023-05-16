const menu = document.querySelector('.menu')
const menuCheck = document.getElementById('menu-button')
const menuLabel = document.querySelector('.menu-container')
const hotPostWrapper = document.querySelector('.hot-wrapper')
const NAVBAR_HEIGHT = document.querySelector('nav').offsetHeight

// if (window.location.pathname === '/old') {
// 	document.getElementById('old').classList.add('active')
// } else if (window.location.pathname === '/random') {
// 	document.getElementById('random').classList.add('active')
// } else if (window.location.pathname === '/newest') {
// 	document.getElementById('newest').classList.add('active')
// }

const links = Array.from(document.getElementsByClassName('sidebar-link'))
links.forEach((link) => {
	if (link.href === window.location.href) {
		link.classList.add('active')
	}
})

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
