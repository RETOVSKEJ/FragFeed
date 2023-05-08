const postWrapper = document.querySelector('.posts-wrapper')
let postsCount = postWrapper.children.length
let lastPost = postWrapper.lastElementChild
let postsOffset = postWrapper.childElementCount

/// INTERSECTION OBSERVER
const LastPostObserver = new IntersectionObserver(
	(entry) => {
		if (entry[0].isIntersecting && postsCount > 2) {
			console.log('eee')
			loadNewPosts()
			console.log(entry[0], lastPost)
			LastPostObserver.unobserve(entry[0].target)
		}
	},
	{
		rootMargin: '200px',
	}
)

const noPostsToFetch = new CustomEvent('custom:NoPostsToFetch', {
	detail: 'nothing to fetch, all posts already fetched',
})
document.body.addEventListener('custom:NoPostsToFetch', (ev) => {
	console.error(ev.detail)
	LastPostObserver.unobserve(lastPost)
})

LastPostObserver.observe(lastPost)

function reduceTags(tagsArr) {
	const result = tagsArr.reduce((sum, elem, next) => sum + elem, '')
	return result
}

async function loadNewPosts() {
	const data = await fetch(`${window.origin}/fetch/posts`, {
		headers: {
			'Cache-control': 'max-age=120',
			'Content-type': 'application/json',
			Accept: 'application/json',
			Offset: postsOffset,
			'posts-count': 6,
		},
	})
	if (data.ok) {
		var result = await data.json()
		if (result.length === 0)
			return document.body.dispatchEvent(noPostsToFetch)
		console.log(result)
		result.forEach((elem, index) => {
			let tagsArr = []
			elem.tags.forEach((tag) =>
				tagsArr.push(
					`<a class="post-tag" href="/tag/${tag}">${tag}</a>`
				)
			)
			const newPost = `<div class="post">
	<h5 class="post-title">${elem.title}</h5>
	<img id="img-preview" src="${elem.image ?? ''}" alt="Post image" />
	<p class="post-body">${elem.body}</p>
	<div class="post-author">
		<p>
			Autor: ${elem.author.nick} ${'days Ago'}
		</p>
	</div>
	<div class="post-tags">
		<label for="tags">Tagi: </label>
        ${reduceTags(tagsArr)}
	</div>
	<div class="post-likes"><button>up</button><button>down</button></div>
</div>`
			postWrapper.insertAdjacentHTML('beforeend', newPost)
		})
	}
	postsOffset += result.length
	postsCount += result.length
	lastPost = postWrapper.lastElementChild
	LastPostObserver.observe(lastPost)
}
