import type { IPageQuery } from '@/api/interface'

export namespace IOneBoxPalletRela {

  // 查询条件
  export interface Query extends IPageQuery {
    boxId?: number
    palletId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    boxId?: number
    palletId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    boxId?: number
    palletId?: number
  }

}