import type { IPageQuery } from '@/api/interface'

export namespace IOneOrder {

  // 查询条件
  export interface Query extends IPageQuery {
    categoryId?: number
    palletId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    categoryId?: number
    palletId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    categoryId?: number
    palletId?: number
  }

}