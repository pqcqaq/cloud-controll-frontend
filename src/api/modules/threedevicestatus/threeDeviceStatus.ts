import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeDeviceStatus } from '@/api/interface/threedevicestatus/threeDeviceStatus'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeDeviceStatusListApi = (params: IThreeDeviceStatus.Query) => {
  return http.get<IPage<IThreeDeviceStatus.Row>>(ADMIN_MODULE + `/three-device-status`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeDeviceStatusApi = (params: IThreeDeviceStatus.Form) => {
  return http.post(ADMIN_MODULE + `/three-device-status`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeDeviceStatusApi = (params: IThreeDeviceStatus.Form) => {
  return http.put(ADMIN_MODULE + `/three-device-status`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeDeviceStatusApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-device-status`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeDeviceStatusDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeDeviceStatus.Row>(ADMIN_MODULE + `/three-device-status/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeDeviceStatusExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-device-status/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeDeviceStatusExcelApi  = (params: IThreeDeviceStatus.Query) => {
  return http.download(ADMIN_MODULE + `/three-device-status/export`, params)
}