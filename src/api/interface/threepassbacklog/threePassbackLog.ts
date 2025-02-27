import type { IPageQuery } from '@/api/interface'

export namespace IThreePassbackLog {

  // 查询条件
  export interface Query extends IPageQuery {
    collectorId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    collectorId?: number
    raw?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    collectorId?: number
    raw?: string
  }

}