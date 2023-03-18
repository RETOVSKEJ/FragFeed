const newsletterBtn = document.getElementById('newsletter-btn')
const newsletterModal = document.getElementById('newsletter-modal')

newsletterBtn.onclick = (ev) => {
	newsletterModal.classList.remove('hidden')
	document.body.style.backgroundColor = 'rgba(0,0,0,1)'
}
