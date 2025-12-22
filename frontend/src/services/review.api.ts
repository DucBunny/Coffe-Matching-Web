import instance from './axios.customize.js'

export const reviewAPI = {
  create: async (
    user_id: string | null,
    shop_id: string,
    rating: number,
    content: string,
    images: Array<string>,
  ) => {
    const res = await instance.post('/review', {
      user_id,
      shop_id,
      rating,
      content,
      images,
    })
    return res.data
  },

  getByShopId: async (
    filters: { page: number; limit: number },
    shopId: string,
  ) => {
    const res = await instance.get(`/review/${shopId}`, {
      params: filters,
    })
    return res.data
  },
}
