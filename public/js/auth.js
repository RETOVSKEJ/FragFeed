const showPassword = document.getElementById('showPassword')
const passwordInput = document.getElementById('password')
const showPasswordIcon = document.getElementById('showPasswordIcon')
const showPasswordLabel = document.getElementById('showPasswordLabel')

function togglePasswordView() {
	if (passwordInput.type === 'text') {
		passwordInput.type = 'password'
		showPasswordIcon.classList.remove('fa-eye-slash')
		showPasswordIcon.classList.add('fa-eye')
	} else {
		passwordInput.type = 'text'
		showPasswordIcon.classList.remove('fa-eye')
		showPasswordIcon.classList.add('fa-eye-slash')
	}
}

showPassword.addEventListener('click', (ev) => {
	togglePasswordView()
})

showPasswordLabel.addEventListener('keyup', (ev) => {
	if (ev.key == 'Enter') {
		togglePasswordView()
	}
})
