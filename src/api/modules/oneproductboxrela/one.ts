import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneProductBoxRela } from '@/api/interface/oneproductboxrela/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneProductBoxRelaListApi = (params: IOneProductBoxRela.Query) => {
  return http.get<IPage<IOneProductBoxRela.Row>>(ADMIN_MODULE + `/one-product-box-rela`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneProductBoxRelaApi = (params: IOneProductBoxRela.Form) => {
  return http.post(ADMIN_MODULE + `/one-product-box-rela`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneProductBoxRelaApi = (params: IOneProductBoxRela.Form) => {
  return http.put(ADMIN_MODULE + `/one-product-box-rela`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneProductBoxRelaApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-product-box-rela`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneProductBoxRelaDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneProductBoxRela.Row>(ADMIN_MODULE + `/one-product-box-rela/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneProductBoxRelaExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-product-box-rela/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneProductBoxRelaExcelApi  = (params: IOneProductBoxRela.Query) => {
  return http.download(ADMIN_MODULE + `/one-product-box-rela/export`, params)
}