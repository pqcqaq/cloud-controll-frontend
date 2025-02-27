import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollector {

  // 查询条件
  export interface Query extends IPageQuery {
    imei?: string
    deviceTypeId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    imei?: string
    diScanGap?: number
    stateCallbackGap?: number
    lockOnStartup?: number
    deviceTypeId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    imei?: string
    diScanGap?: number
    stateCallbackGap?: number
    lockOnStartup?: number
    deviceTypeId?: number
  }

}