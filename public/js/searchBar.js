const searchContainer = document.getElementById('search-bar')
const searchInput = document.getElementById('search')
const searchResults = document.getElementById('search-results')
const searchPostsWrapper = document.getElementById('search-posts-wrapper')
const searchResult = document.getElementsByClassName('search-result')
const showMoreBtn = document.getElementById('show-more')
const resultsCounter = document.getElementById('results-counter')

const SEARCH_MAX_VIEWED = 5
let postsArr = []

const fetchEvent = new Event('custom:fetchLoaded')

// Do something only after fetch has ended
document.addEventListener('custom:fetchLoaded', (ev) => {
	console.log(ev)
	searchInput.addEventListener('keyup', async (ev) => {
		if (ev.key === 'Enter' && ev.target.value !== '') {
			window.location.replace(
				`${window.origin}/search?q=${ev.target.value}`
			)
		}

		const posts = filterPosts(ev.target.value)
		searchPostsWrapper.innerHTML = ''
		if (posts.length == 0) {
			resultsCounter.innerText = 'Brak wyników...'
			showMoreBtn.classList.add('hidden')
		} else {
			let postsViewed
			posts.length < SEARCH_MAX_VIEWED // pokaz 1-5 postow jesli nie ma więcej
				? (postsViewed = posts.length)
				: (postsViewed = SEARCH_MAX_VIEWED)

			resultsCounter.textContent = `Znalezionych wyników: ${posts.length}`
			showMoreBtn.classList.toggle(
				// Schowaj przycisk jeśli jest mniej niż 5 postów
				'hidden',
				posts.length < SEARCH_MAX_VIEWED
			)
			showMoreBtn.href = `/search?q=${searchInput.value}`

			for (let i = 0; i < postsViewed; i++) {
				const title = posts[i].title
				const imgSrc = posts[i].image
				const date = new Date(posts[i].createdAt)
				const options = {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					hour12: false,
				}
				const elem = `<div class="search-result">
					<a href="/${posts[i].id}">
						<img src="${imgSrc}" alt="image">
						<div class='flex-c fs-small'>
							<strong>${title}</strong>
							<em>${date.toLocaleString('pl', options)}</em>
						</div>
					</a>
				</div>`
				searchPostsWrapper.insertAdjacentHTML('beforeend', elem)
			}
		}
	})
})

fetch(`${window.origin}/`, {
	headers: {
		'Content-type': 'application/json',
		accept: 'application/json',
		search: true,
	},
})
	.then((data) => data.json())
	.then((result) => {
		postsArr = result
		document.dispatchEvent(fetchEvent)
	})

function filterPosts(query) {
	let postsArrFiltered = postsArr
		.map((elem) => elem)
		.filter((elem) =>
			elem.title.includes(query) || elem.body.includes(query)
				? elem
				: null
		)
	if (postsArrFiltered.length === 0) {
		searchPostsWrapper.classList.add('hidden')
	} else {
		searchPostsWrapper.classList.remove('hidden')
	}
	return postsArrFiltered
}

searchContainer.addEventListener('focusin', (ev) => {
	/// wyswietla rezultaty w momencie przelaczenia focusu
	if (searchInput.value.length > 0) {
		searchResults.classList.remove('hidden')
	}
	/// wyswietla rezultaty po pierwszym wpisaniu (musi byc > zamiast ==, zeby wyswietlic tez podczas wklejania pelnego tesktu)
	searchInput.addEventListener('input', (ev) => {
		if (ev.target.value.length > 0) {
			searchResults.classList.remove('hidden')
		}
	})
})

searchContainer.addEventListener('focusout', (ev) => {
	if (!ev.relatedTarget) {
		searchResults.classList.add('hidden')
	}
})
