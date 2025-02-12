import type { IPageQuery } from '@/api/interface'

export namespace IOneDestination {

  // 查询条件
  export interface Query extends IPageQuery {
    address?: string
    enable?: number
    label?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    address?: string
    enable?: number
    label?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    address?: string
    enable?: number
    label?: string
  }

}