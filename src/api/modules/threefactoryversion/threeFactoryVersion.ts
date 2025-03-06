import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeFactoryVersion } from '@/api/interface/threefactoryversion/threeFactoryVersion'
import type { UploadRawFile } from "element-plus/es/components/upload/src/upload";
import type { AxiosRequestConfig } from 'axios';

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeFactoryVersionListApi = (params: IThreeFactoryVersion.Query) => {
  return http.get<IPage<IThreeFactoryVersion.Row>>(ADMIN_MODULE + `/three-factory-version`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeFactoryVersionApi = (params: IThreeFactoryVersion.Form) => {
  return http.post(ADMIN_MODULE + `/three-factory-version`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeFactoryVersionApi = (params: IThreeFactoryVersion.Form) => {
  return http.put(ADMIN_MODULE + `/three-factory-version`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeFactoryVersionApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-factory-version`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeFactoryVersionDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeFactoryVersion.Row>(ADMIN_MODULE + `/three-factory-version/${id}`)
}

/**
* 导入excel
* @param params
*/
export const importThreeFactoryVersionExcelApi = (params : UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/three-factory-version/import`, params, config)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportThreeFactoryVersionExcelApi  = (params: IThreeFactoryVersion.Query) => {
  return http.download(ADMIN_MODULE + `/three-factory-version/export`, params)
}