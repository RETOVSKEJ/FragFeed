const formPreview = document.getElementById('formPreview')
const sendBtnPreview = document.getElementById('sendBtnPreview')
const editBtnPreview = document.getElementById('editBtnPreview')

formPreview.addEventListener('submit', (ev) => {
	console.log('test')
	sendBtnPreview.setAttribute('disabled', true)
	sendBtnPreview.disabled = true
	editBtnPreview.setAttribute('disabled', true)
	editBtnPreview.disabled = true
})
