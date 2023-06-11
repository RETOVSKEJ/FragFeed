const postWrapper = document.querySelector('.posts-wrapper')
let postsCount = postWrapper.children.length
let lastPost = postWrapper.lastElementChild
let postsOffset = postWrapper.childElementCount

// const activeSidebarLink = document.querySelector('sidebar-link[href="/old"]')
// activeSidebarLink.classList.remove('active')

/// HIDE not accessible images

const imgs = Array.from(document.getElementsByTagName('img'))
imgs.forEach((img) => {
	if (img.src == null || img.src === location.href) {
		img.style.display = 'none'
	}
})

/// INTERSECTION OBSERVER
const LastPostObserver = new IntersectionObserver(
	(entry) => {
		if (entry[0].isIntersecting && postsCount > 2) {
			loadNewPosts()
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
	const user = {
		_id: localStorage.getItem('_id'),
	}
	const [likedPosts, dislikedPosts] = await Promise.all([
		fetch(`${window.origin}/users/${user._id}/liked-posts`).then((res) =>
			res.json()
		),
		fetch(`${window.origin}/users/${user._id}/disliked-posts`).then((res) =>
			res.json()
		),
	])
	const URL =
		window.location.pathname === '/old'
			? `${window.origin}/fetch/posts?q=old`
			: `${window.origin}/fetch/posts`

	const data = await fetch(URL, {
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
		result.forEach((elem, index) => {
			let tagsArr = []
			elem.tags.forEach((tag) =>
				tagsArr.push(
					`<a class="post-tag" href="/tag/${tag}">${tag}</a>`
				)
			)
			const compiled =
				ejs.compile(`<div class="post" data-atr="<%= post.id %>">
				<div class="post-top">
					<a href="<%= post.id %>"><h5 class="post-title"><%= post.title %></h5></a>
				<div class="post-author-div">
					<p class="post-author">
						<strong>Autor:</strong> <a class="author" href="/users/<%= post.author.nick %>"> <%= post.author.nick %></a> 
						<em class="post-date"><%= post.createdAtString %></em>
					</p>
					<p class="post-author">
						<% if(post.edited_by){ %>Edytowane przez:<a class="author" href="/users/<%= post.edited_by.nick %>"> <%= post.edited_by.nick %></a>
						<em class="post-date"><%= post.updatedAtString %><%}%></em>
					</p>
				</div>
				</div>
				<% if(locals.urlPath == "/preview"){ %>
				<img
					id="img-preview"
					src="<%= post.image %>"
					alt="Uploaded Image preview"
				/>
				<script defer>
					// IF USER JUST UPLOADED IMAGE TO PREVIEW
					if (localStorage.getItem("img_data")) {
						const img = document.getElementById("img-preview")
						img.src = localStorage.getItem("img_data")
					}
				</script>
				<% } else { %>
				<% if(post.image) { %>
					<a class="post-img" href="/<%= post.id %>"><img onerror="this.onerror=null; this.src='/assets/nophoto.png'; this.alt = 'No Photo Available'"  id="img-preview" src="https://fragfeed-bucket.s3.eu-central-1.amazonaws.com/<%= post.image %>" alt="Post image" />
				<% } else { %>
					<a class="post-img" href="/<%= post.id %>"><img id="img-preview" src="/assets/nophoto.png" alt="No Photo available" />
				<% }} %>
					<div id="post-likes" data-atr="<%= locals?.user?._id %>" class="post-likes">
						<% if(likedPosts.likedPosts?.includes(post.id)){ %>
							<button data-voted='true' data-atr="<%= post.id %>" id="upvote-btn" class="fa-solid fa-chevron-up upvote-btn"></button>
						<% } else { %>
							<button data-atr="<%= post.id %>" id="upvote-btn" class="fa-solid fa-chevron-up upvote-btn"></button>
						<% } %>
						<% if(dislikedPosts.dislikedPosts?.includes(post.id)){ %>
							<button data-voted="true" data-atr="<%= post.id %>" id="downvote-btn" class="fa-solid fa-chevron-down downvote-btn"></button> 
						<% } else { %>
							<button data-atr="<%= post.id %>" id="downvote-btn" class="fa-solid fa-chevron-down downvote-btn"></button> 
						<% } %>
					</div>
					<div class="post-likes__count"><%= post.likes || 0 %></div>
					</a>
				<div class="post-body">
					<p class="post-text"><%= post.body %></p>
					<div class="post-tags">
						<% if(post.tags.length > 0) { %>
						<label for="tags"><strong>Tagi:</strong> </label>
							<% for(const tag of post.tags) {%>
								<a class="post-tag" href="/tag/<%= tag %>"><%= tag %></a>
							<% } %>
						<% } %>
					</div>
				</div>
			</div>
		`)

			const newPostTest = compiled({
				post: elem,
				locals: {
					user: user,
				},
				likedPosts: likedPosts,
				dislikedPosts: dislikedPosts,
			})

			postWrapper.insertAdjacentHTML('beforeend', newPostTest)
		})
	}
	postsOffset += result.length
	postsCount += result.length
	lastPost = postWrapper.lastElementChild
	LastPostObserver.observe(lastPost)
	AddListenersToButtons()
}
