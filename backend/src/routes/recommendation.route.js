import express from 'express'
import * as recommendationController from '@/controllers/recommendation.controller.js'

const recommendationRouter = express.Router()

recommendationRouter.get('/', recommendationController.getRecommendations)

export default recommendationRouter
