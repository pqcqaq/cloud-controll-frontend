import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollectorUptime {

  // 查询条件
  export interface Query extends IPageQuery {
    uptime?: number
    countDateStart?: string
    countDateEnd?: string
    hours?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    uptime?: number
    countDate?: string
    hours?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    uptime?: number
    countDate?: string
    hours?: number
  }

}