import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IVProductShippingInfoComplete } from '@/api/interface/vproductshippinginfocomplete/vProductShippingInfoComplete'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getVProductShippingInfoCompleteListApi = (params: IVProductShippingInfoComplete.Query) => {
  return http.get<IPage<IVProductShippingInfoComplete.Row>>(ADMIN_MODULE + `/v-product-shipping-info-complete`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createVProductShippingInfoCompleteApi = (params: IVProductShippingInfoComplete.Form) => {
  return http.post(ADMIN_MODULE + `/v-product-shipping-info-complete`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateVProductShippingInfoCompleteApi = (params: IVProductShippingInfoComplete.Form) => {
  return http.put(ADMIN_MODULE + `/v-product-shipping-info-complete`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeVProductShippingInfoCompleteApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/v-product-shipping-info-complete`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getVProductShippingInfoCompleteDetailApi = (params: { id: string  }) => {
  const { id } = params
  return http.get<IVProductShippingInfoComplete.Row>(ADMIN_MODULE + `/v-product-shipping-info-complete/${id}`)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportVProductShippingInfoCompleteExcelApi  = (params: IVProductShippingInfoComplete.Query) => {
  return http.download(ADMIN_MODULE + `/v-product-shipping-info-complete/export`, params)
}