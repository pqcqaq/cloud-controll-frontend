import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IThreeFirmware } from '@/api/interface/threefirmware/threeFirmware'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getThreeFirmwareListApi = (params: IThreeFirmware.Query) => {
  return http.get<IPage<IThreeFirmware.Row>>(ADMIN_MODULE + `/three-firmware`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createThreeFirmwareApi = (params: IThreeFirmware.Form) => {
  return http.post(ADMIN_MODULE + `/three-firmware`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateThreeFirmwareApi = (params: IThreeFirmware.Form) => {
  return http.put(ADMIN_MODULE + `/three-firmware`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeThreeFirmwareApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/three-firmware`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getThreeFirmwareDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IThreeFirmware.Row>(ADMIN_MODULE + `/three-firmware/${id}`)
}

