import type { IPageQuery } from '@/api/interface'

export namespace IOneProductBoxRela {

  // 查询条件
  export interface Query extends IPageQuery {
    productId?: number
    boxId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    productId?: number
    boxId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    productId?: number
    boxId?: number
  }

}