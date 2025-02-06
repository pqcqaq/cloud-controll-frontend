import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneOrder } from '@/api/interface/oneorder/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneOrderListApi = (params: IOneOrder.Query) => {
  return http.get<IPage<IOneOrder.Row>>(ADMIN_MODULE + `/one-order`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneOrderApi = (params: IOneOrder.Form) => {
  return http.post(ADMIN_MODULE + `/one-order`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneOrderApi = (params: IOneOrder.Form) => {
  return http.put(ADMIN_MODULE + `/one-order`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneOrderApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-order`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneOrderDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneOrder.Row>(ADMIN_MODULE + `/one-order/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneOrderExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-order/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneOrderExcelApi  = (params: IOneOrder.Query) => {
  return http.download(ADMIN_MODULE + `/one-order/export`, params)
}