import type { IPageQuery } from '@/api/interface'

export namespace IOneWeigh {

  // 查询条件
  export interface Query extends IPageQuery {
    weight?: number
    productId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    weight?: number
    productId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    weight?: number
    productId?: number
  }

}