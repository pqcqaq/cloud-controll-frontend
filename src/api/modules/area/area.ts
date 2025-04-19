import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IArea } from '@/api/interface/area/area'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getAreaListApi = (params: IArea.Query) => {
  return http.get<IPage<IArea.Row>>(ADMIN_MODULE + `/area`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createAreaApi = (params: IArea.Form) => {
  return http.post(ADMIN_MODULE + `/area`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateAreaApi = (params: IArea.Form) => {
  return http.put(ADMIN_MODULE + `/area`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeAreaApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/area`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getAreaDetailApi = (params: { id: string }) => {
  const { id } = params
  return http.get<IArea.Row>(ADMIN_MODULE + `/area/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importAreaExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/area/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportAreaExcelApi  = (params: IArea.Query) => {
  return http.download(ADMIN_MODULE + `/area/export`, params)
}