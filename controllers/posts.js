const Joi = require('joi')
const fs = require('fs')
const path = require('path')
const { storeImage } = require('../middleware/imageHandler')
const Post = require('../models/Post')
const assert = require('assert')
const {
	getAllPosts,
	getHotPosts,
	patchLikedPosts,
	patchDislikedPosts,
	getAllLikedPostsService,
	getLikedPostsService,
	getDislikedPostsService,
} = require('../services/queries')
const { get } = require('http')

/// / req.session.preview usuwane w: getPost, getPostForm, getEditForm / ustawiane w:
/// / req.session.post usuwane w: getHome / ustawiane w: getPost, getEditForm

/// / post.create i post.update({id: req.params.id}) --> DOKŁADNIE TO SAMO
/// / ale inne dla preview a dla posta

//msg: req.flash('logInfo')  --> info wyswietlane dla usera w EJS, jak "Logged sucessfuly" itp.

/// ////////// GET ////////////////

// @route /:id
async function getPost(req, res) {
	const hotPosts = await getHotPosts()
	const post = await Post.findOne({ id: req.params.id })
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
	post.createdAtString = post.createdAt.toLocaleString('pl', {
		dateStyle: 'long',
		timeStyle: 'short',
	}) // local variable for templates
	post.updatedAtString = post.updatedAt.toLocaleString('pl', {
		dateStyle: 'long',
		timeStyle: 'short',
	}) // local variable for templates
	req.session.post = post
	req.session.preview = null
	if (!post) {
		res.status(400)
		throw new Error('Nie istnieje taki post')
	}

	let dislikedPosts, likedPosts
	;[likedPosts, dislikedPosts] = await getAllLikedPostsService(
		res.locals?.user
	)

	return res.status(200).render('post', {
		dislikedPosts,
		likedPosts,
		hotPosts,
		post,
		msg: req.flash('logInfo'),
	})
}

async function getRandomPost(req, res) {
	const hotPosts = await getHotPosts()
	let dislikedPosts, likedPosts
	;[likedPosts, dislikedPosts] = await getAllLikedPostsService(
		res.locals?.user
	)
	const postsCount = await Post.countDocuments()
	const randInt = Math.floor(Math.random() * postsCount)
	const post = await Post.findOne()
		.skip(randInt)
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()

	post.createdAtString = post.createdAt.toLocaleString('pl', {
		dateStyle: 'long',
		timeStyle: 'short',
	}) // local variable for templates
	post.updatedAtString = post.updatedAt.toLocaleString('pl', {
		dateStyle: 'long',
		timeStyle: 'short',
	}) // local variable for templates
	if (!post) {
		res.status(400)
		throw new Error('Nie istnieje taki post')
	}
	req.flash('logInfo', 'Wylosowałes post nr: ' + post.id)
	return res.status(200).render('post', {
		hotPosts,
		likedPosts,
		dislikedPosts,
		post,
		msg: req.flash('logInfo'),
	})
}

async function getSearchResults(req, res) {
	const results = await getAllPosts(req.query.q)

	return res.status(200).render('search', {
		likedPosts: [],
		dislikedPosts: [],
		posts: results,
		postsCount: results.length,
		msg: req.flash('logInfo'),
	})
}

async function getTaggedPosts(req, res) {
	const hotPosts = await getHotPosts()
	let dislikedPosts, likedPosts
	;[likedPosts, dislikedPosts] = await getAllLikedPostsService(
		res.locals?.user
	)
	const tag = req.params.tag
	const posts = await Post.find({ tags: { $in: [tag] } })
		.populate('author', '-password')
		.sort('-id')
		.exec()
	if (posts.length === 0) return res.redirect('/')
	return res.status(200).render('tag', {
		likedPosts,
		dislikedPosts,
		hotPosts,
		posts: posts,
		tag: tag,
		msg: req.flash('logInfo'),
	})
}

// @route /new
async function getPostForm(req, res) {
	const POST_PREVIEW_DATA = req.session.preview
	req.session.preview = null
	const hotPosts = await getHotPosts()
	return res.status(200).render('postForm', {
		hotPosts,
		post: POST_PREVIEW_DATA,
		msg: req.flash('logInfo'),
	})
}

// @route /:id/edit
async function getEditForm(req, res) {
	const hotPosts = await getHotPosts()
	const post = await Post.findOne({ id: req.params.id })
		.populate('author', '-password')
		.populate('edited_by', '-password')
		.exec()
	req.session.post = post
	req.session.preview = null
	return res
		.status(200)
		.render('postForm', { hotPosts, post, msg: req.flash('logInfo') })
}

/// //////// PREVIEW FUNC ////////////

// @route /preview
// @desc  displaying preview of the post
async function getPostPreview(req, res) {
	if (req.headers.referer === undefined) return res.redirect('back')
	if (
		req.headers.referer.includes('/new') ||
		req.headers.referer.includes('/edit')
	) {
		res.locals.referer = req.headers.referer
		res.locals.post_id = req.session.post?.id
		return res.render('preview', {
			hotPosts: await getHotPosts(),
			likedPosts: [],
			dislikedPosts: [],
			post: req.session.preview,
			msg: req.flash('logInfo'),
		})
	}
	return res.redirect('back')
}

// @route /preview POST
// @desc  passing informations for displaying preview of the post
function passPostPreview(req, res) {
	const { minlength: titleMinLength, maxlength: titleMaxLength } =
		Post.schema.paths.title.options
	const { minlength: bodyMinLength, maxlength: bodyMaxLength } =
		Post.schema.paths.body.options
	console.log(req.headers.referer)

	/// needs to use JOI since we're not posting the post yet. (OPTIMALIZATION)
	const Schema = Joi.object({
		title: Joi.string()
			.min(titleMinLength[0])
			.max(titleMaxLength[0])
			.required(),
		body: Joi.string()
			.min(bodyMinLength[0])
			.max(bodyMaxLength[0])
			.required(),
		image: Joi.optional(),
		tags: Joi.optional(),
	})
	const { error } = Schema.validate(req.body)
	if (error) {
		req.flash('logInfo', error.details[0].message)
		return res.redirect('back')
	}

	// kopiujemy image z ostatnio widzaniego posta, aby mozna bylo go wyswietlic w Edit -> preview
	const image = req.session.post?.image
	req.session.preview = {
		author: req.user,
		title: req.body.title,
		body: req.body.body,
		filename: req.body.image, // original name of input file
		image,
		tags: req.body.tags,
	}

	return res.redirect('/preview')
}

/// ////////// POST ////////////////

// @route /new
async function postPost(req, res) {
	const LAST_ID = (await Post.findOne().sort('-id'))?.id ?? 0 // przypisuje id 0 jesli zaden post nie istnieje // Lepsze od countDocuments, bo nie zmienia ID w przypadku usuniecia
	const POST_PREVIEW = req.session.preview ?? {}
	const PREVIEW_IMAGE_PROVIDED = !!POST_PREVIEW.filename // JESLI WSTAWIMY NOWE ZDJECIE I WCISNIEMY PREVIEW
	const IMAGE_PROVIDED = !!req.file // JESLI WSTAWIMY NOWE ZDJECIE

	const POST_TAGS =
		req.body.tags.length > 0 ? req.body.tags.split(',') : req.body.tags
	const POST_PREVIEW_TAGS =
		POST_PREVIEW?.tags?.length > 0
			? POST_PREVIEW?.tags.split(',')
			: POST_PREVIEW?.tags

	let post
	let imageSrcPath
	const newFilename = `${LAST_ID + 1}-${
		new Date().toISOString().split('T')[0]
	}` // returns id-yyyy-mm-dd

	if (!req.is('multipart/form-data')) {
		/// TYLKO DLA POST PREVIEW  -  inny formularz z preview.ejs
		if (PREVIEW_IMAGE_PROVIDED) {
			const filePath = await storeImage(
				req.body.img_data,
				POST_PREVIEW.filename,
				newFilename
			) // automatically adds extension
			const index = filePath.indexOf('public')
			imageSrcPath = filePath.slice(index)
		}
	}

	if (IMAGE_PROVIDED) {
		// multer & sharp
		const filePath = await renameFile(req.file, newFilename)
		const index = filePath.indexOf('public')
		imageSrcPath = filePath.slice(index)
	}

	if (Object.keys(POST_PREVIEW).length > 0) {
		// Tylko jesli wstawiamy bezposrednio po preview
		post = await Post.create({
			id: LAST_ID + 1,
			title: POST_PREVIEW.title,
			body: POST_PREVIEW.body,
			author: req.user,
			image: imageSrcPath,
			tags: POST_PREVIEW_TAGS || undefined,
		})
	} else {
		post = await Post.create({
			id: LAST_ID + 1,
			title: req.body.title,
			body: req.body.body,
			author: req.user,
			image: imageSrcPath ?? undefined,
			tags: POST_TAGS || undefined,
		})
	}

	console.log('TEST NOWY', post)
	res.status(201)
	return res.redirect(`/${post.id}`)
}

/// ////////// PUT PATCH DELETE ////////////////

// @route /:id/edit    PATCH
async function editPost(req, res) {
	const POST_PREVIEW = req.session.preview ?? {}
	const PREVIEW_IMAGE_PROVIDED = !!POST_PREVIEW.filename
	const IMAGE_PROVIDED = !!req.file
	console.log('EDITED POST TEST', POST_PREVIEW, req.session.post)
	const POST_TAGS =
		req.body.tags.length > 0 ? req.body.tags.split(',') : req.body.tags
	const POST_PREVIEW_TAGS =
		POST_PREVIEW?.tags?.length > 0
			? POST_PREVIEW?.tags.split(',')
			: POST_PREVIEW?.tags

	const newFilename = `${req.params.id}-${
		new Date().toISOString().split('T')[0]
	}` // returns id-yyyy-mm-dd
	let imageSrcPath
	if (!req.is('multipart/form-data')) {
		/// TYLKO DLA POST PREVIEW
		if (PREVIEW_IMAGE_PROVIDED) {
			// JESLI WSTAWIMY NOWE ZDJECIE I WCISNIEMY PREVIEW (storeImage & canvas client-side)
			const filePath = await storeImage(
				req.body.img_data,
				POST_PREVIEW.filename,
				newFilename
			)
			const index = filePath.indexOf('public')
			imageSrcPath = filePath.slice(index) // public/assetts/uploads...

			if (imageSrcPath !== req.session.post.image) {
				await deleteOldFile(req.session.post.image)
			}
		}
	}

	if (IMAGE_PROVIDED) {
		// JESLI WSTAWIMY NOWE ZDJECIE  (multer & sharp)
		imageSrcPath = await renameFile(req.file, newFilename)
		const index = imageSrcPath.indexOf('public') // musi byc, ze względów na problem w przegladarkach (blocked:other)
		imageSrcPath = imageSrcPath.slice(index)

		if (imageSrcPath !== req.session.post.image) {
			/// usun stare zdjecie (rename nie nadpisuje plikow, jesli maja inne rozszerzenia)
			await deleteOldFile(req.session.post.image)
		}
	}

	if (Object.keys(POST_PREVIEW).length > 0) {
		// Tylko jesli wstawiamy bezposrednio po preview
		await Post.updateOne(
			{ id: req.params.id },
			{
				title: POST_PREVIEW.title,
				body: POST_PREVIEW.body,
				edited_by: req.user,
				image: imageSrcPath,
				tags: POST_PREVIEW_TAGS || undefined,
			}
		)
	} else {
		await Post.updateOne(
			{ id: req.params.id },
			{
				title: req.body.title,
				body: req.body.body,
				edited_by: req.user,
				image: imageSrcPath ?? undefined,
				tags: POST_TAGS || undefined,
			}
		)
	}

	req.flash('logInfo', 'Edited Succesfully')
	return res.redirect(`/${req.params.id}`)
}

// @route /:id
async function deletePost(req, res) {
	const post = await Post.findOneAndDelete({ id: req.params.id }).exec()
	if (!post) {
		throw new Error('Nie ma posta o takim ID!')
	} else {
		req.flash('logInfo', 'usunieto post:', post.title)
		console.log('usunieto post o id: ', post.id)
	}
	return res.redirect('/')
}

async function patchLikePost(req, res) {
	const POST_ID = req.params.id
	const USER_ID = res.locals.user._id

	if (req.query.type === 'upvote') {
		await patchLikedPosts(USER_ID, POST_ID, 'vote')
	} else if (req.query.type === 'downvote') {
		await patchDislikedPosts(USER_ID, POST_ID, 'vote')
	} else if (req.query.type === 'removeupvote') {
		await patchLikedPosts(USER_ID, POST_ID, 'remove')
	} else if (req.query.type === 'removedownvote') {
		await patchDislikedPosts(USER_ID, POST_ID, 'remove')
	} else {
		res.status(500)
		throw new Error('Wystąpił błąd podczas lajkowania posta')
	}
	return res.status(200).json({})
}

module.exports = {
	getPost,
	getRandomPost,
	getSearchResults,
	getTaggedPosts,
	getPostForm,
	getPostPreview,
	passPostPreview,
	getEditForm,
	postPost,
	patchLikePost,
	editPost,
	deletePost,
}

async function renameFile(reqFile, newFilename) {
	const pathExt = path.extname(reqFile.originalname)
	/* eslint-disable no-param-reassign */
	newFilename += pathExt
	const imageSrcPath = path.resolve(
		'public',
		'assets',
		'uploads',
		newFilename
	)
	try {
		await fs.promises.rename(
			path.resolve(reqFile.path), // path..../uploaded
			path.resolve(imageSrcPath)
		) // public/assets/uploads/...jpg
	} catch (err) {
		console.err('renameFile() error: ', err)
	}
	return imageSrcPath
}

async function deleteOldFile(filePath) {
	const pathToFile = path.resolve(filePath)
	try {
		await fs.promises.unlink(pathToFile)
		console.log(pathToFile, 'deleted')
	} catch (err) {
		console.error('deleteOldFile() error: ', err)
	}
}
