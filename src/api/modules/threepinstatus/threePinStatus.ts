import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreePinStatus } from '@/api/interface/threepinstatus/threePinStatus'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreePinStatusListApi = (params: IThreePinStatus.Query) => {
  return http.get<IPage<IThreePinStatus.Row>>(ADMIN_MODULE + `/three-pin-status`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreePinStatusApi = (params: IThreePinStatus.Form) => {
  return http.post(ADMIN_MODULE + `/three-pin-status`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreePinStatusApi = (params: IThreePinStatus.Form) => {
  return http.put(ADMIN_MODULE + `/three-pin-status`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreePinStatusApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-pin-status`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreePinStatusDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreePinStatus.Row>(ADMIN_MODULE + `/three-pin-status/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreePinStatusExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-pin-status/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreePinStatusExcelApi  = (params: IThreePinStatus.Query) => {
  return http.download(ADMIN_MODULE + `/three-pin-status/export`, params)
}