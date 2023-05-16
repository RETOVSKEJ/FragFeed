// document.addEventListener('DOMContentLoaded', ev => {
//     document.querySelector('#preview')
// })

localStorage.removeItem('img_data')

const imageInput = document.getElementById('image')
const preview = document.getElementById('preview')
const form = document.getElementById('postForm')
const previewBtn = document.getElementById('previewBtn')
const sendBtn = document.getElementById('sendBtn')
const title = document.getElementById('title')
const body = document.getElementById('body')

form.addEventListener('submit', validate)
title.addEventListener('input', updateSendBtn)
body.addEventListener('input', updateSendBtn)

function updateSendBtn() {
	if (title.value.length < 5 || body.value.length < 15) {
		sendBtn.disabled = true
		previewBtn.disabled = true
		sendBtn.classList.add('disabled')
		previewBtn.classList.add('disabled')
	} else {
		sendBtn.disabled = false
		previewBtn.disabled = false
		sendBtn.classList.remove('disabled')
		previewBtn.classList.remove('disabled')
	}
}

function validate(ev) {
	if (imageInput.files[0]) {
		const res = validateSize()
		if (res) {
			ev.preventDefault()
			throw res
		}
	}

	if (!preview.querySelector('p')) {
		const infoMsg = document.createElement('p', { classList: 'info' })
		infoMsg.textContent = 'Uploading...'
		preview.prepend(infoMsg)
	}
}

function previewImg(ev) {
	/// CHECK FOR ERRORS
	if (document.getElementById('error-message')) {
		// old Errors to delete
		document.getElementById('error-message').remove()
	}
	if (document.getElementById('img-preview')) {
		document.getElementById('img-preview').remove()
	}

	const err = validateSize()
	if (err) {
		const errMsg = document.createElement('p', {
			classList: 'error-message',
		})
		errMsg.id = 'error-message'
		errMsg.textContent = err
		// preview.before(errMsg)
		preview.prepend(errMsg)
		return err
	}

	/// READ IMAGE
	const image = document.createElement('img')

	const fr = new FileReader()
	fr.readAsDataURL(imageInput.files[0])
	fr.addEventListener('load', (ev) => {
		const data_img = fr.result
		image.src = data_img

		/// Compress image
		image.onload = (ev) => {
			const WIDTH = 1280 /// SIZE OF OUR COMPRESSED FILE
			const RATIO = WIDTH / ev.target.width

			const canvas = document.createElement('canvas')
			canvas.width = WIDTH
			canvas.height = ev.target.height * RATIO

			const context = canvas.getContext('2d')
			context.drawImage(image, 0, 0, canvas.width, canvas.height)

			const compressedImg = document.createElement('img')
			const compressedImage_url = context.canvas.toDataURL(
				'image/jpeg',
				90
			)
			compressedImg.src = compressedImage_url
			compressedImg.id = 'img-preview'
			compressedImg.classList.add('img-preview')
			preview.append(compressedImg)

			// STORE IMAGE
			localStorage.setItem('img_data', compressedImage_url)
		}
	})
	return undefined
}

function validateSize(ev) {
	const file = imageInput.files[0]
	if (!file) {
		const err = new Error('No image Selected')
		return err.message
	}

	const SIZE_LIMIT = 5000 // W KiB // tyle samo co limit w express.urlencoded({}) lub .json({})
	const size = file.size / 1024

	if (size > SIZE_LIMIT) {
		// file.size jest w Bajtach
		sendBtn.disabled = true
		sendBtn.classList.add('disabled')
		const err = new Error(
			`Zdjęcie jest zbyt duże. Rozmiar: ${size.toFixed(2) / 1000} MB.
            max: ${SIZE_LIMIT / 1000} MB`
		)
		return err.message
	}

	sendBtn.disabled = false
	sendBtn.classList.remove('disabled')

	return false
}
