import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollectorLogin {

  // 查询条件
  export interface Query extends IPageQuery {
    collectorId?: number
    accessToken?: string
    shutdownAtStart?: string
    shutdownAtEnd?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    collectorId?: number
    accessToken?: string
    shutdownAt?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    collectorId?: number
    accessToken?: string
    shutdownAt?: string
  }

}