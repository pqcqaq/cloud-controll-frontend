import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeCollectorLogin } from '@/api/interface/threecollectorlogin/threeCollectorLogin'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeCollectorLoginListApi = (params: IThreeCollectorLogin.Query) => {
  return http.get<IPage<IThreeCollectorLogin.Row>>(ADMIN_MODULE + `/three-collector-login`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeCollectorLoginApi = (params: IThreeCollectorLogin.Form) => {
  return http.post(ADMIN_MODULE + `/three-collector-login`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeCollectorLoginApi = (params: IThreeCollectorLogin.Form) => {
  return http.put(ADMIN_MODULE + `/three-collector-login`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeCollectorLoginApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-collector-login`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeCollectorLoginDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeCollectorLogin.Row>(ADMIN_MODULE + `/three-collector-login/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeCollectorLoginExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-collector-login/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeCollectorLoginExcelApi  = (params: IThreeCollectorLogin.Query) => {
  return http.download(ADMIN_MODULE + `/three-collector-login/export`, params)
}