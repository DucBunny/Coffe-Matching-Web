import express from 'express'
import * as reviewController from '@/controllers/review.controller.js'

const reviewRouter = express.Router()

reviewRouter.get('/:shopId', reviewController.getReviewsByShopId)
reviewRouter.post('/', reviewController.createReview)

export default reviewRouter
