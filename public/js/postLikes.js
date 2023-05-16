const likesDiv = document.getElementById('post-likes')

const types = ['upvote', 'downvote', 'removeupvote', 'removedownvote']

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
	ev.preventDefault()
	if (!LoggedIn()) return
	const POST_ID = ev.target.getAttribute('data-atr')
	const next = ev.target.nextElementSibling
	const nextVoted = next.getAttribute('data-voted')

	//REMOVE VOTE
	const ALREADY_VOTED = ev.target.getAttribute('data-voted')
	if (ALREADY_VOTED) {
		removeUpvote(POST_ID, ev)
		return
	}

	// ADD VOTE & REMOVE OPPOSITE VOTE
	const [click, nextClick] = await Promise.all([
		fetch(`${window.location.origin}/${POST_ID}/like?type=${types[0]}`, {
			method: 'PATCH',
		}),
		nextVoted && removeDownvote(POST_ID, ev),
	])

	nextClick ? next.removeAttribute('data-voted') : null
	click.ok ? ev.target.setAttribute('data-voted', 'true') : null
}

async function handleDownvote(ev) {
	ev.preventDefault()
	if (!LoggedIn()) return
	const POST_ID = ev.target.getAttribute('data-atr')
	const prev = ev.target.previousElementSibling
	const prevVoted = prev.getAttribute('data-voted')

	//REMOVE VOTE
	const ALREADY_VOTED = ev.target.getAttribute('data-voted')
	if (ALREADY_VOTED) {
		removeDownvote(POST_ID, ev)
		return
	}
	// ADD DOWNVOTE & REMOVE OPPOSITE VOTE
	const [click, prevClick] = await Promise.all([
		fetch(`${window.location.origin}/${POST_ID}/like?type=${types[1]}`, {
			method: 'PATCH',
		}),
		prevVoted && removeUpvote(POST_ID, ev),
	])

	prevClick ? prev.removeAttribute('data-voted') : null
	click.ok ? ev.target.setAttribute('data-voted', 'true') : null
}

function AddListenersToButtons() {
	var upvoteBtns = document.getElementsByClassName('upvote-btn')
	var downvoteBtns = document.getElementsByClassName('downvote-btn')
	var upvoteBtnsArray = Array.from(upvoteBtns)
	var downvoteBtnsArray = Array.from(downvoteBtns)

	upvoteBtnsArray.forEach((elem) =>
		elem.addEventListener('click', handleUpvote)
	)
	downvoteBtnsArray.forEach((elem) =>
		elem.addEventListener('click', handleDownvote)
	)
}

AddListenersToButtons()

async function removeUpvote(POST_ID, ev) {
	await fetch(`${window.location.origin}/${POST_ID}/like?type=${types[2]}`, {
		method: 'PATCH',
	})
	ev.target.removeAttribute('data-voted')
	return true // DONE
}

async function removeDownvote(POST_ID, ev) {
	await fetch(`${window.location.origin}/${POST_ID}/like?type=${types[3]}`, {
		method: 'PATCH',
	})
	ev.target.removeAttribute('data-voted')
	return true // DONE
}
