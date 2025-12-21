import searchService from '@/services/search.service.js'

async function getShopByFilter(req, res) {
  try {
    // Forward query params to service for filtering
    const filters = req.query || {}
    const response = await searchService.getShopByFilter(filters)

    return res.status(200).json({
      success: true,
      data: response.data,
      meta: response.meta
    })
  } catch (error) {
    console.error('SearchController.getShopByFilter error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách quán.',
      error: error.message
    })
  }
}

async function getAllAreas(req, res) {
  try {
    const areas = await searchService.getAllAreas()

    return res.status(200).json({
      success: true,
      data: areas
    })
  } catch (error) {
    console.error('SearchController.getAllAreas error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách địa điểm.',
      error: error.message
    })
  }
}

async function getAllPurposes(req, res) {
  try {
    const purposes = await searchService.getAllPurposes()

    return res.status(200).json({
      success: true,
      data: purposes
    })
  } catch (error) {
    console.error('SearchController.getAllPurposes error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách mục đích.',
      error: error.message
    })
  }
}

async function getAllAmenities(req, res) {
  try {
    const amenities = await searchService.getAllAmenities()

    return res.status(200).json({
      success: true,
      data: amenities
    })
  } catch (error) {
    console.error('SearchController.getAllAmenities error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tiện nghi.',
      error: error.message
    })
  }
}

export default { getShopByFilter, getAllAreas, getAllPurposes, getAllAmenities }
