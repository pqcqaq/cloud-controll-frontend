import type { IPageQuery } from '@/api/interface'

export namespace IOneCategory {

  // 查询条件
  export interface Query extends IPageQuery {
    sku?: string
    idCode?: number
    name?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    sku?: string
    idCode?: number
    name?: string
    minWeight?: number
    maxWeight?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    sku?: string
    idCode?: number
    name?: string
    minWeight?: number
    maxWeight?: number
  }

}