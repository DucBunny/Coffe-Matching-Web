import express from 'express'
import favoriteController from '@/controllers/favorite.controller.js'

const favoriteRouter = express.Router()

favoriteRouter.get('/:userId', favoriteController.getFavoriteByUserId)

export default favoriteRouter
