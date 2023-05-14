const likesDiv = document.getElementById('post-likes')
var upvoteBtns = document.getElementsByClassName('upvote-btn')
var downvoteBtns = document.getElementsByClassName('downvote-btn')
var upvoteBtnsArray = Array.from(upvoteBtns)
var downvoteBtnsArray = Array.from(downvoteBtns)

const types = ['upvote', 'downvote']

function LoggedIn() {
	const LOGGED_IN = !!likesDiv.getAttribute('data-atr')
	if (!LOGGED_IN) {
		toastText.textContent = 'Musisz być zalogowany!'
		toast.classList.remove('toast-hidden')
		setTimeout(() => toast.classList.add('toast-hidden'), 4000)
		return false
	}
	toastText.textContent = 'Zagłosowałeś na post!'
	toast.classList.remove('toast-hidden')
	setTimeout(() => toast.classList.add('toast-hidden'), 4000)
	return true
}

async function handleUpvote(ev) {
	const POST_ID = ev.target.getAttribute('data-atr')
	if (!LoggedIn()) return
	const click = await fetch(
		`${window.location.origin}/${POST_ID}/like?type=${types[0]}`,
		{
			method: 'PATCH',
		}
	)
}

async function handleDownvote(ev) {
	const POST_ID = ev.target.getAttribute('data-atr')
	if (!LoggedIn()) return
	const click = await fetch(
		`${window.location.origin}/${POST_ID}/like?type=${types[1]}`,
		{
			method: 'PATCH',
		}
	)
}

upvoteBtnsArray.forEach((elem) => elem.addEventListener('click', handleUpvote))
downvoteBtnsArray.forEach((elem) =>
	elem.addEventListener('click', handleDownvote)
)
