import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneSeqNumber } from '@/api/interface/oneseqnumber/oneSeqNumber'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneSeqNumberListApi = (params: IOneSeqNumber.Query) => {
  return http.get<IPage<IOneSeqNumber.Row>>(ADMIN_MODULE + `/one-seq-number`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneSeqNumberApi = (params: IOneSeqNumber.Form) => {
  return http.post(ADMIN_MODULE + `/one-seq-number`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneSeqNumberApi = (params: IOneSeqNumber.Form) => {
  return http.put(ADMIN_MODULE + `/one-seq-number`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneSeqNumberApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-seq-number`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneSeqNumberDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneSeqNumber.Row>(ADMIN_MODULE + `/one-seq-number/${id}`)
}

