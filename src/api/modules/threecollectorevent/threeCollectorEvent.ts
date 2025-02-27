import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeCollectorEvent } from '@/api/interface/threecollectorevent/threeCollectorEvent'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeCollectorEventListApi = (params: IThreeCollectorEvent.Query) => {
  return http.get<IPage<IThreeCollectorEvent.Row>>(ADMIN_MODULE + `/three-collector-event`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeCollectorEventApi = (params: IThreeCollectorEvent.Form) => {
  return http.post(ADMIN_MODULE + `/three-collector-event`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeCollectorEventApi = (params: IThreeCollectorEvent.Form) => {
  return http.put(ADMIN_MODULE + `/three-collector-event`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeCollectorEventApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-collector-event`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeCollectorEventDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeCollectorEvent.Row>(ADMIN_MODULE + `/three-collector-event/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeCollectorEventExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-collector-event/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeCollectorEventExcelApi  = (params: IThreeCollectorEvent.Query) => {
  return http.download(ADMIN_MODULE + `/three-collector-event/export`, params)
}