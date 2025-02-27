import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneBoxPalletRela } from '@/api/interface/oneboxpalletrela/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneBoxPalletRelaListApi = (params: IOneBoxPalletRela.Query) => {
  return http.get<IPage<IOneBoxPalletRela.Row>>(ADMIN_MODULE + `/one-box-pallet-rela`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneBoxPalletRelaApi = (params: IOneBoxPalletRela.Form) => {
  return http.post(ADMIN_MODULE + `/one-box-pallet-rela`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneBoxPalletRelaApi = (params: IOneBoxPalletRela.Form) => {
  return http.put(ADMIN_MODULE + `/one-box-pallet-rela`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneBoxPalletRelaApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-box-pallet-rela`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneBoxPalletRelaDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneBoxPalletRela.Row>(ADMIN_MODULE + `/one-box-pallet-rela/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneBoxPalletRelaExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-box-pallet-rela/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneBoxPalletRelaExcelApi  = (params: IOneBoxPalletRela.Query) => {
  return http.download(ADMIN_MODULE + `/one-box-pallet-rela/export`, params)
}