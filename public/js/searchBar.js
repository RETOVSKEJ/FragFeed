const searchBar = document.getElementById('search')
const searchResults = document.getElementById('search-results')
const searchResult = document.getElementsByClassName('search-result')

const SEARCH_BAR_MAX_POSTS = 5

async function loadPosts(query) {
	const data = await fetch(`${window.origin}/`, {
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			data: query,
		},
	})
	if (!data.ok) return
	const results = await data.json()
	return results
}

searchBar.addEventListener('input', async (ev) => {
	const posts = await loadPosts(ev.target.value)
	searchResults.innerHTML = ''
	if (posts.length == 0 && posts) {
		const p = document.createElement('p')
		p.innerText = 'Brak wyników'
		searchResults.append(p)
	} else {
		for (let i = 0; i < SEARCH_BAR_MAX_POSTS; i++) {
			const title = posts[i].title
			const imgSrc = posts[i].image
			const elem = `<div class="search-result"><img src="${imgSrc}" alt="image"><strong>${title}</strong></div>`
			searchResults.insertAdjacentHTML('beforeend', elem)
		}
	}
})

searchBar.addEventListener('focus', (ev) => {
	searchResults.classList.remove('hidden')
})

searchBar.addEventListener('focusout', (ev) => {
	searchResults.classList.add('hidden')
})
