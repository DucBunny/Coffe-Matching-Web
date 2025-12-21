import * as shopRepo from '@/repositories/shop.repository.js'

const handleGetShopById = async (id) => {
  return await shopRepo.getShopById(id)
}

export { handleGetShopById }
