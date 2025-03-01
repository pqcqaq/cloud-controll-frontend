import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeCollectorLock } from '@/api/interface/threecollectorlock/threeCollectorLock'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeCollectorLockListApi = (params: IThreeCollectorLock.Query) => {
  return http.get<IPage<IThreeCollectorLock.Row>>(ADMIN_MODULE + `/three-collector-lock`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeCollectorLockApi = (params: IThreeCollectorLock.Form) => {
  return http.post(ADMIN_MODULE + `/three-collector-lock`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeCollectorLockApi = (params: IThreeCollectorLock.Form) => {
  return http.put(ADMIN_MODULE + `/three-collector-lock`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeCollectorLockApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-collector-lock`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeCollectorLockDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeCollectorLock.Row>(ADMIN_MODULE + `/three-collector-lock/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeCollectorLockExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-collector-lock/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeCollectorLockExcelApi  = (params: IThreeCollectorLock.Query) => {
  return http.download(ADMIN_MODULE + `/three-collector-lock/export`, params)
}