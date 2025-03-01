import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeCollector } from '@/api/interface/threecollector/threeCollector'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeCollectorListApi = (params: IThreeCollector.Query) => {
  return http.get<IPage<IThreeCollector.Row>>(ADMIN_MODULE + `/three-collector`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeCollectorApi = (params: IThreeCollector.Form) => {
  return http.post(ADMIN_MODULE + `/three-collector`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeCollectorApi = (params: IThreeCollector.Form) => {
  return http.put(ADMIN_MODULE + `/three-collector`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeCollectorApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-collector`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeCollectorDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeCollector.Row>(ADMIN_MODULE + `/three-collector/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeCollectorExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-collector/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeCollectorExcelApi  = (params: IThreeCollector.Query) => {
  return http.download(ADMIN_MODULE + `/three-collector/export`, params)
}

/**
 * 发送锁定消息
 */
export const sendLockMsgApi = (params: { id: number, endAt?: string }) => {
  return http.post(ADMIN_MODULE + `/three-collector/lock/${params.id}`, params)
}

/**
 * 发送解锁消息
 */
export const sendUnlockMsgApi = (params: { id: number }) => {
  return http.post(ADMIN_MODULE + `/three-collector/unlock/${params.id}`)
}

/**
 * 发送更新消息
 */
export const sendUpdateMsgApi = (params: { id: number }) => {
  return http.post(ADMIN_MODULE + `/three-collector/update/${params.id}`)
}