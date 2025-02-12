import type { IPageQuery } from '@/api/interface'

export namespace IOneSeqNumber {

  // 查询条件
  export interface Query extends IPageQuery {
    createTimeStart?: string
    createTimeEnd?: string
    updateTimeStart?: string
    updateTimeEnd?: string
    key?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    key?: string
    value?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    key?: string
    value?: number
  }

}