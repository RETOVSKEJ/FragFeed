const Post = require('../models/Post')
const User = require('../models/user')

async function getAllPosts(query) {
	const regex = new RegExp(query)
	const posts = await Post.find({
		visible: true,
		$or: [{ title: { $regex: regex } }, { body: { $regex: regex } }],
	})
		.sort('-id')
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
	return posts
}

async function getPosts(
	postsCount = null,
	{ sort = 'asc', objQuery = { visible: true }, offset = null }
) {
	return await Post.find(objQuery)
		.limit(postsCount)
		.sort(sort)
		.skip(offset)
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
}

async function getHotPosts() {
	const posts = await Post.find({ visible: true })
		.sort('-likes')
		.limit(6)
		.exec()
	return posts
}

async function getAllLikedPostsService(user) {
	let dislikedPosts, likedPosts
	if (user) {
		;[likedPosts, dislikedPosts] = await Promise.all([
			getLikedPostsService(user._id),
			getDislikedPostsService(user._id),
		])
	}

	// likedPosts ??= []
	// dislikedPosts ??= []
	likedPosts = likedPosts || []
	dislikedPosts = dislikedPosts || []
	return [likedPosts, dislikedPosts]
}

async function patchLikedPosts(userId, postId, type) {
	if (type === 'vote') {
		const succeed = await User.updateOne(
			{ _id: userId },
			{ $addToSet: { likedPosts: postId } }
		)
		succeed &&
			(await Post.updateOne({ id: postId }, { $inc: { likes: 1 } }))
	} else if (type === 'remove') {
		const succeed = await User.updateOne(
			{ _id: userId },
			{ $pull: { likedPosts: postId } }
		)
		succeed &&
			(await Post.updateOne({ id: postId }, { $inc: { likes: -1 } }))
	} else {
		throw Error('Wrong type passed to PatchLikedPosts')
	}
}

async function patchDislikedPosts(userId, postId, type) {
	if (type === 'vote') {
		const succeed = await User.updateOne(
			{ _id: userId },
			{ $addToSet: { dislikedPosts: postId } }
		)
		succeed &&
			(await Post.updateOne({ id: postId }, { $inc: { likes: -1 } }))
	} else if (type === 'remove') {
		const succeed = await User.updateOne(
			{ _id: userId },
			{ $pull: { dislikedPosts: postId } }
		)
		succeed &&
			(await Post.updateOne({ id: postId }, { $inc: { likes: 1 } }))
	} else {
		throw Error('Wrong type passed to PatchLikedPosts')
	}
}

async function getLikedPostsService(userId) {
	const posts = await User.findOne({ _id: userId })
		.select('likedPosts')
		.exec()
	return posts
}

async function getDislikedPostsService(userId) {
	const posts = await User.findOne({ _id: userId })
		.select('dislikedPosts')
		.exec()
	return posts
}

async function getVotedPosts(userId) {
	let posts = await User.findOne({ _id: userId })
		.select('nick likedPosts dislikedPosts')
		.exec()
	return posts
}

async function getIsPostLiked(userId, postId) {
	return await User.findOne({
		_id: userId,
		likedPosts: { $in: [postId] },
	}).exec()
}

async function getIsPostDisliked(userId, postId) {
	return await User.findOne({
		_id: userId,
		dislikedPosts: { $in: [postId] },
	}).exec()
}

async function getLikedPostsPopulatedService(likedPostsArr) {
	return await Post.find({ id: { $in: likedPostsArr } })
}

module.exports = {
	getAllPosts,
	getAllLikedPostsService,
	getPosts,
	getHotPosts,
	patchLikedPosts,
	patchDislikedPosts,
	getLikedPostsService,
	getLikedPostsPopulatedService,
	getDislikedPostsService,
	getVotedPosts,
	getIsPostLiked,
	getIsPostDisliked,
}
