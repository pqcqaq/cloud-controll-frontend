import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneBox } from '@/api/interface/onebox/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneBoxListApi = (params: IOneBox.Query) => {
  return http.get<IPage<IOneBox.Row>>(ADMIN_MODULE + `/one-box`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneBoxApi = (params: IOneBox.Form) => {
  return http.post(ADMIN_MODULE + `/one-box`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneBoxApi = (params: IOneBox.Form) => {
  return http.put(ADMIN_MODULE + `/one-box`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneBoxApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-box`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneBoxDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneBox.Row>(ADMIN_MODULE + `/one-box/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneBoxExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-box/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneBoxExcelApi  = (params: IOneBox.Query) => {
  return http.download(ADMIN_MODULE + `/one-box/export`, params)
}

/**
 * 重新打印
 */
export const reprintMidCodeApi = (params: IOneBox.ReprintMidCode) => {
  return http.post(ADMIN_MODULE + `/one-box/reprint-mid-code`, params, { loading: true })
}