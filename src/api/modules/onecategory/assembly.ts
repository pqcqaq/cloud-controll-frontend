import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOneCategory } from '@/api/interface/onecategory/assembly'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOneCategoryListApi = (params: IOneCategory.Query) => {
  return http.get<IPage<IOneCategory.Row>>(ADMIN_MODULE + `/one-category`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOneCategoryApi = (params: IOneCategory.Form) => {
  return http.post(ADMIN_MODULE + `/one-category`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOneCategoryApi = (params: IOneCategory.Form) => {
  return http.put(ADMIN_MODULE + `/one-category`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOneCategoryApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/one-category`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOneCategoryDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOneCategory.Row>(ADMIN_MODULE + `/one-category/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importOneCategoryExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-category/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOneCategoryExcelApi  = (params: IOneCategory.Query) => {
  return http.download(ADMIN_MODULE + `/one-category/export`, params)
}