import * as shopService from '@/services/shop.service.js'
import ApiError from '@/utils/api-error.js'

export async function getShopById(req, res, next) {
  try {
    const { id } = req.query

    if (!id) {
      throw new ApiError('Shop ID is required', 400, 'MISSING_SHOP_ID')
    }

    const shop = await shopService.handleGetShopById(id)

    if (!shop) {
      throw new ApiError('Shop not found', 404, 'SHOP_NOT_FOUND')
    }

    return res.status(200).json({
      success: true,
      data: shop
    })
  } catch (error) {
    next(error)
  }
}
