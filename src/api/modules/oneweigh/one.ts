import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneWeigh } from '@/api/interface/oneweigh/one'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneWeighListApi = (params: IOneWeigh.Query) => {
  return http.get<IPage<IOneWeigh.Row>>(ADMIN_MODULE + `/one-weigh`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneWeighApi = (params: IOneWeigh.Form) => {
  return http.post(ADMIN_MODULE + `/one-weigh`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneWeighApi = (params: IOneWeigh.Form) => {
  return http.put(ADMIN_MODULE + `/one-weigh`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneWeighApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-weigh`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneWeighDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneWeigh.Row>(ADMIN_MODULE + `/one-weigh/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneWeighExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-weigh/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneWeighExcelApi  = (params: IOneWeigh.Query) => {
  return http.download(ADMIN_MODULE + `/one-weigh/export`, params)
}