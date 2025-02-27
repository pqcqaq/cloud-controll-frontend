import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollectorEvent {

  // 查询条件
  export interface Query extends IPageQuery {
    level?: string
    type?: string
    msg?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    level?: string
    type?: string
    msg?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    level?: string
    type?: string
    msg?: string
  }

}