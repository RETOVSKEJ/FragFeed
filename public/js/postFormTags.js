const container = document.getElementById('tags-container')
const tagsList = document.getElementById('tags-list')
const tagsInput = document.getElementById('tags-input')
const tags = document.getElementsByClassName('tag')

const maxTags = 6
const tagsToSubmit = []

// returns newLength of tagsToSubmit
function createTag(tag) {
	const li = `<li id='tag' class='tag'>${tag}<i id='remove' class="fa-solid fa-xmark"></i></li>`
	tagsList.insertAdjacentHTML('afterbegin', li)
	return tagsToSubmit.push(tag)
}

function removeTag(tag) {
	const index = tagsToSubmit.indexOf(tag)
	if (index !== -1) tagsToSubmit.splice(index, 1)
}

tagsList.addEventListener('click', (ev) => {
	if (ev.target.matches('#remove')) {
		removeTag(ev.target.parentElement.innerText)
		ev.target.parentElement.remove()
	}
})

tagsInput.addEventListener('input', (ev) => {
	if (ev.data === ',') {
		let newTag = ev.target.value.replaceAll(',', '')
		newTag = newTag.toLowerCase().replace(/\s+/g, ' ').trim() // regex to trim ALL whitespaces, and only leave a space between them

		if (tagsToSubmit.includes(newTag)) return
		if (tagsToSubmit.length === maxTags) return
		if (newTag.length > 25) return
		if (newTag.length > 2) {
			// 1 charakter to przecinek
			createTag(newTag)
			ev.target.value = null
		}
	}
})

/// recreating tags -->  for /edit ONLY
if (window.EJSpost) {
	for (const tag of window.EJSpost.tags) {
		createTag(tag)
	}
	delete window.EJSpost
}

// sendBtn.addEventListener('click', (ev) => {
// 	form.setAttribute('action', '/new')
// 	form.setAttribute('enctype', 'multipart/form-data')
// })

previewBtn.addEventListener('click', (ev) => {
	localStorage.setItem('title', title.value)
	localStorage.setItem('body', body.value)
	form.setAttribute('action', '/preview')
	form.setAttribute('enctype', 'application/x-www-form-urlencoded')
})

form.addEventListener('submit', (ev) => {
	ev.preventDefault()
	if (tagsToSubmit.length > 0) {
		tagsInput.value = tagsToSubmit.join(',')
	}
	form.submit()
})
