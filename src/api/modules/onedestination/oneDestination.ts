import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneDestination } from '@/api/interface/onedestination/oneDestination'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneDestinationListApi = (params: IOneDestination.Query) => {
  return http.get<IPage<IOneDestination.Row>>(ADMIN_MODULE + `/one-destination`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneDestinationApi = (params: IOneDestination.Form) => {
  return http.post(ADMIN_MODULE + `/one-destination`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneDestinationApi = (params: IOneDestination.Form) => {
  return http.put(ADMIN_MODULE + `/one-destination`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneDestinationApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-destination`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneDestinationDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneDestination.Row>(ADMIN_MODULE + `/one-destination/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneDestinationExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-destination/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneDestinationExcelApi  = (params: IOneDestination.Query) => {
  return http.download(ADMIN_MODULE + `/one-destination/export`, params)
}