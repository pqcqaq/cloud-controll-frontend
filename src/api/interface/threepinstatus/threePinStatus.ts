import type { IPageQuery } from '@/api/interface'

export namespace IThreePinStatus {

  // 查询条件
  export interface Query extends IPageQuery {
    collectorId?: number
    active?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    collectorId?: number
    pinDef?: number
    counts?: number
    triggerTime?: string
    uptime?: number
    active?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    collectorId?: number
    pinDef?: number
    counts?: number
    triggerTime?: string
    uptime?: number
    active?: number
  }

}