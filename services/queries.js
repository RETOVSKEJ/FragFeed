const Post = require('../models/Post')
const User = require('../models/User')

async function getAllPosts(query) {
	const regex = new RegExp(query)
	const posts = await Post.find({
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
	{ sort = 'asc', offset = null, objQuery = null }
) {
	return await Post.find({ objQuery })
		.limit(postsCount)
		.sort(sort)
		.skip(offset)
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
}

async function getHotPosts() {
	const posts = await Post.find().sort('-likes').limit(6).exec()
	return posts
}

async function patchLikedPosts(userId, postId, type) {
	if (type === 'vote') {
		console.log('JESTEM HERE')
		return await User.updateOne(
			{ _id: userId },
			{ $addToSet: { likedPosts: postId } }
		)
	} else if (type === 'remove') {
		console.log('JESTEM HERE REMOVE')
		return await User.updateOne(
			{ _id: userId },
			{ $pull: { likedPosts: postId } }
		)
	} else {
		throw Error('Wrong type passed to PatchLikedPosts')
	}
}

async function patchDislikedPosts(userId, postId, type) {
	if (!(type === 'vote' || type === 'remove'))
		throw Error('Wrong type passed to PatchDisLikedPosts')
	return type === 'vote'
		? await User.updateOne(
				{ _id: userId },
				{ $addToSet: { dislikedPosts: postId } }
		  )
		: await User.updateOne(
				{ _id: userId },
				{ $pull: { dislikedPosts: postId } }
		  )
}

async function getLikedPosts(userId) {
	const posts = await User.findOne({ _id: userId })
		.select('likedPosts')
		.exec()
	return posts
}

async function getDislikedPosts(userId) {
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

module.exports = {
	getAllPosts,
	getPosts,
	getHotPosts,
	patchLikedPosts,
	patchDislikedPosts,
	getLikedPosts,
	getDislikedPosts,
	getVotedPosts,
}
