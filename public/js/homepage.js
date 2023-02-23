const postWrapper = document.querySelector('.posts-wrapper')
let lastPost = postWrapper.lastElementChild
let postsOffset = postWrapper.childElementCount

/// INTERSECTION OBSERVER

const LastPostObserver = new IntersectionObserver(
	(entry) => {
		if (entry[0].isIntersecting) {
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

LastPostObserver.observe(lastPost)

function reduceTags(tagsArr) {
	const result = tagsArr.reduce((sum, elem, next) => sum + elem, '')
	return result
}

async function loadNewPosts() {
	const data = await fetch(window.origin, {
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
	<div class="post-likes"></div>
	<div class="post-comments"><span>Like</span></div>
</div>`
			postWrapper.insertAdjacentHTML('beforeend', newPost)
		})
	}
	postsOffset += result.length
	lastPost = postWrapper.lastElementChild
	LastPostObserver.observe(lastPost)
}
