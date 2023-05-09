const toast = document.getElementById('toast')
const button = document.getElementById('toast-close')
const toastText = document.getElementById('toast-text')

if (toastText.textContent) {
	toast.classList.remove('toast-hidden')
	setTimeout(() => toast.classList.add('toast-hidden'), 4000)
}

button.onclick = () => toast.classList.add('toast-hidden')
