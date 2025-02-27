import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreePassbackLog } from '@/api/interface/threepassbacklog/threePassbackLog'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreePassbackLogListApi = (params: IThreePassbackLog.Query) => {
  return http.get<IPage<IThreePassbackLog.Row>>(ADMIN_MODULE + `/three-passback-log`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreePassbackLogApi = (params: IThreePassbackLog.Form) => {
  return http.post(ADMIN_MODULE + `/three-passback-log`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreePassbackLogApi = (params: IThreePassbackLog.Form) => {
  return http.put(ADMIN_MODULE + `/three-passback-log`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreePassbackLogApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-passback-log`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreePassbackLogDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreePassbackLog.Row>(ADMIN_MODULE + `/three-passback-log/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreePassbackLogExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-passback-log/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreePassbackLogExcelApi  = (params: IThreePassbackLog.Query) => {
  return http.download(ADMIN_MODULE + `/three-passback-log/export`, params)
}