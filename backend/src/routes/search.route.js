import express from 'express'
import searchController from '@/controllers/search.controller.js'

const searchRouter = express.Router()

searchRouter.get('/', searchController.getShopByFilter)
searchRouter.get('/areas', searchController.getAllAreas)
searchRouter.get('/purposes', searchController.getAllPurposes)
searchRouter.get('/amenities', searchController.getAllAmenities)

export default searchRouter
