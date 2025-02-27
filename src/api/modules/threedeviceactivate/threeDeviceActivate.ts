import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeDeviceActivate } from '@/api/interface/threedeviceactivate/threeDeviceActivate'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeDeviceActivateListApi = (params: IThreeDeviceActivate.Query) => {
  return http.get<IPage<IThreeDeviceActivate.Row>>(ADMIN_MODULE + `/three-device-activate`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeDeviceActivateApi = (params: IThreeDeviceActivate.Form) => {
  return http.post(ADMIN_MODULE + `/three-device-activate`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeDeviceActivateApi = (params: IThreeDeviceActivate.Form) => {
  return http.put(ADMIN_MODULE + `/three-device-activate`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeDeviceActivateApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-device-activate`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeDeviceActivateDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeDeviceActivate.Row>(ADMIN_MODULE + `/three-device-activate/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeDeviceActivateExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-device-activate/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeDeviceActivateExcelApi  = (params: IThreeDeviceActivate.Query) => {
  return http.download(ADMIN_MODULE + `/three-device-activate/export`, params)
}