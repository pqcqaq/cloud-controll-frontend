import type { IPageQuery } from '@/api/interface'

export namespace IOneProduct {

  // 查询条件
  export interface Query extends IPageQuery {
    code?: string
    categoryId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    code?: string
    categoryId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    code?: string
    categoryId?: number
    categoryName?: string
    printed?: boolean
    printedTime?: string
    weight?: number
    midBoxTime?: string
  }

}