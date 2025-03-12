import type { IPageQuery } from '@/api/interface'

export namespace IThreeFirmware {

  // 查询条件
  export interface Query extends IPageQuery {
    version?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    version?: string
    fileId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    version?: string
    fileId?: number
  }

}