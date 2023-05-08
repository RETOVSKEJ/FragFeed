const newsletterBtn = document.getElementById('newsletter-btn')
const newsletterModal = document.getElementById('newsletter-modal')
const newsletterClose = document.getElementById('newsletter-close')

newsletterBtn.onclick = (ev) => {
	newsletterModal.showModal()
}

newsletterClose.onclick = (ev) => {
	newsletterModal.close()
}

newsletterModal.addEventListener('click', function (event) {
	var rect = newsletterModal.getBoundingClientRect()
	var isInDialog =
		rect.top <= event.clientY &&
		event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX &&
		event.clientX <= rect.left + rect.width
	if (!isInDialog) {
		newsletterModal.close()
	}
})
