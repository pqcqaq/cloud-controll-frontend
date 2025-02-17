import type { IPageQuery } from '@/api/interface'

export namespace IOneBox {

  // 查询条件
  export interface Query extends IPageQuery {
    midBoxCode?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    midBoxCode?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    midBoxCode?: string
    printed?: boolean
    snCodes: string[]
    createTime: string
    printedTime: string
    palletTime: string
  }

  export interface ReprintMidCode {
    code: string
  }

}