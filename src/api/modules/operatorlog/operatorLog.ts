import http from '@/api'
import { ADMIN_MODULE } from '@/api/helper/prefix'
import type { IPage } from '@/api/interface'
import type { IOperatorLog } from '@/api/interface/operatorlog/operatorLog'

/**
* 查询列表
* @param params
* @returns {*}
*/
export const getOperatorLogListApi = (params: IOperatorLog.Query) => {
  return http.get<IPage<IOperatorLog.Row>>(ADMIN_MODULE + `/operator-log`, params)
}

/**
* 添加
* @param params
* @returns {*}
*/
export const createOperatorLogApi = (params: IOperatorLog.Form) => {
  return http.post(ADMIN_MODULE + `/operator-log`, params)
}

/**
* 修改
* @param params
* @returns {*}
*/
export const updateOperatorLogApi = (params: IOperatorLog.Form) => {
  return http.put(ADMIN_MODULE + `/operator-log`, params)
}

/**
* 删除
* @param params
* @returns {*}
*/
export const removeOperatorLogApi = (params: { ids: (string | number)[] }) => {
 return http.delete(ADMIN_MODULE + `/operator-log`, params)
}

/**
* 获取详情
* @param params
* @returns {*}
*/
export const getOperatorLogDetailApi = (params: { id: number }) => {
  const { id } = params
  return http.get<IOperatorLog.Row>(ADMIN_MODULE + `/operator-log/${id}`)
}

/**
* 导出excel
* @param params
* @returns {*}
*/
export const exportOperatorLogExcelApi  = (params: IOperatorLog.Query) => {
  return http.download(ADMIN_MODULE + `/operator-log/export`, params)
}