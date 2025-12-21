import express from 'express'
import shopController from '@/controllers/shop.controller.js'

const shopRouter = express.Router()

shopRouter.get('/', shopController.getShopById)

export default shopRouter
