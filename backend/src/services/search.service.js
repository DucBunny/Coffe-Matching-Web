import * as shopRepo from '@/repositories/shop.repository.js'

async function getShopByFilter(filters = {}) {
  const shops = await shopRepo.findShopByFilter(filters)
  return shops
}

async function getAllAreas() {
  return await shopRepo.getAllAreas()
}

async function getAllPurposes() {
  return await shopRepo.getAllPurposes()
}

async function getAllAmenities() {
  return await shopRepo.getAllAmenities()
}

export default { getShopByFilter, getAllAreas, getAllPurposes, getAllAmenities }
