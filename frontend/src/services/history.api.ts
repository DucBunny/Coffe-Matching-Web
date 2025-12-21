import instance from './axios.customize.js'

export const historyAPI = {
  create: async (user_id: string | null, shop_id: string) => {
    const res = await instance.post('/history', { user_id, shop_id })
    return res.data
  },

  getAll: async (user_id: string, cursor?: string, limit?: number) => {
    const res = await instance.get('/history', {
      params: { user_id, cursor, limit },
    })
    return res.data
  },

  deleteMany: async (_ids: Array<string>) => {
    const res = await instance.delete('/history', { data: { _ids } })
    return res.data
  },
}
