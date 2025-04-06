import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeCollectorUptime } from '@/api/interface/threecollectoruptime/threeCollectorUptime'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeCollectorUptimeListApi = (params: IThreeCollectorUptime.Query) => {
  return http.get<IPage<IThreeCollectorUptime.Row>>(ADMIN_MODULE + `/three-collector-uptime`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeCollectorUptimeApi = (params: IThreeCollectorUptime.Form) => {
  return http.post(ADMIN_MODULE + `/three-collector-uptime`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeCollectorUptimeApi = (params: IThreeCollectorUptime.Form) => {
  return http.put(ADMIN_MODULE + `/three-collector-uptime`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeCollectorUptimeApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-collector-uptime`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeCollectorUptimeDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeCollectorUptime.Row>(ADMIN_MODULE + `/three-collector-uptime/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeCollectorUptimeExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-collector-uptime/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeCollectorUptimeExcelApi  = (params: IThreeCollectorUptime.Query) => {
  return http.download(ADMIN_MODULE + `/three-collector-uptime/export`, params)
}