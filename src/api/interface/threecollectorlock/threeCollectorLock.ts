import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollectorLock {

  // 查询条件
  export interface Query extends IPageQuery {
    collectorId?: number
    lockedTimeStart?: string
    lockedTimeEnd?: string
    unlockTimeStart?: string
    unlockTimeEnd?: string
    status?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    collectorId?: number
    lockedTime?: string
    unlockTime?: string
    status?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    collectorId?: number
    lockedTime?: string
    unlockTime?: string
    status?: string
  }

}