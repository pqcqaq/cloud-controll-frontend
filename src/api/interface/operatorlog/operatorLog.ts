import type { IPageQuery } from '@/api/interface'

export namespace IOperatorLog {

  // 查询条件
  export interface Query extends IPageQuery {
    level?: string
    msg?: string
    success?: number
    cause?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    level?: string
    msg?: string
    success?: number
    cause?: string
    metadata?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    level?: string
    msg?: string
    success?: number
    cause?: string
    metadata?: string
  }

}