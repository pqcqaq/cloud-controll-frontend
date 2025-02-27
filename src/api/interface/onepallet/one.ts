import type { IPageQuery } from '@/api/interface'

export namespace IOnePallet {

  // 查询条件
  export interface Query extends IPageQuery {
    palletCode?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    palletCode?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    palletCode?: string
    printed?: boolean
    printedTime?: string
    midBoxCodes?: string[]
    createTime?: string
  }

}