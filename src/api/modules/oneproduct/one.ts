import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneProduct } from '@/api/interface/oneproduct/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneProductListApi = (params: IOneProduct.Query) => {
  return http.get<IPage<IOneProduct.Row>>(ADMIN_MODULE + `/one-product`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneProductApi = (params: IOneProduct.Form) => {
  return http.post(ADMIN_MODULE + `/one-product`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneProductApi = (params: IOneProduct.Form) => {
  return http.put(ADMIN_MODULE + `/one-product`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneProductApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-product`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneProductDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneProduct.Row>(ADMIN_MODULE + `/one-product/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneProductExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-product/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneProductExcelApi  = (params: IOneProduct.Query) => {
  return http.download(ADMIN_MODULE + `/one-product/export`, params)
}