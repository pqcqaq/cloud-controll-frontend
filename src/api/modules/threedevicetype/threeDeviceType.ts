import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeDeviceType } from '@/api/interface/threedevicetype/threeDeviceType'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeDeviceTypeListApi = (params: IThreeDeviceType.Query) => {
  return http.get<IPage<IThreeDeviceType.Row>>(ADMIN_MODULE + `/three-device-type`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeDeviceTypeApi = (params: IThreeDeviceType.Form) => {
  return http.post(ADMIN_MODULE + `/three-device-type`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeDeviceTypeApi = (params: IThreeDeviceType.Form) => {
  return http.put(ADMIN_MODULE + `/three-device-type`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeDeviceTypeApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-device-type`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeDeviceTypeDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeDeviceType.Row>(ADMIN_MODULE + `/three-device-type/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeDeviceTypeExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-device-type/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeDeviceTypeExcelApi  = (params: IThreeDeviceType.Query) => {
  return http.download(ADMIN_MODULE + `/three-device-type/export`, params)
}