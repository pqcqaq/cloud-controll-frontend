import type { IPageQuery } from '@/api/interface'

export namespace IThreeFactoryVersion {

  // 查询条件
  export interface Query extends IPageQuery {
    imei?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    imei?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    imei?: string
  }

}