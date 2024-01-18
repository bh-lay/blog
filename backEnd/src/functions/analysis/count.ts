import { getDbCollection } from '@/database/DB'


export default async function (type: string, params: Record<string, unknown>) {

  const {collection} = await getDbCollection('analysis')

  const count = await collection.countDocuments({
    type,
    params
  })
  return {
    pv: count || 0
  }
}
