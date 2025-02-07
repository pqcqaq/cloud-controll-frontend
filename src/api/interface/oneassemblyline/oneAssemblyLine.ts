import type { IPageQuery } from '@/api/interface'

export namespace IOneAssemblyLine {

  // 查询条件
  export interface Query extends IPageQuery {
    name?: string
    categoryId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    name?: string
    categoryCode?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    name?: string
    categoryId?: number
  }

}