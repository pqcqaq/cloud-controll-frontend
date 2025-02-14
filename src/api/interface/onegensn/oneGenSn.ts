import type { IPageQuery } from '@/api/interface'

export namespace IOneGenSn {

  // 查询条件
  export interface Query extends IPageQuery {
    code?: string
    seq?: number
    produceTimeStart?: string
    produceTimeEnd?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    categoryId?: number
    code?: string
    seq?: number
    used?: number
    produceTime?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    categoryId?: number
    code?: string
    seq?: number
    used?: number
    produceTime?: string
  }

}