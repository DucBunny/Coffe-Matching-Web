import express from 'express'
import * as shopController from '@/controllers/shop.controller.js'

const shopRouter = express.Router()

shopRouter.get('/', shopController.getShopById)

export default shopRouter
