import * as shopService from '@/services/shop.service.js'

async function getShopById(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu shop id'
      })
    }

    const shop = await shopService.handleGetShopById(id)

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quán'
      })
    }

    return res.status(200).json({
      success: true,
      data: shop
    })
  } catch (error) {
    console.error('ShopController.getShopById error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin quán.',
      error: error.message
    })
  }
}

export default {
  getShopById
}
