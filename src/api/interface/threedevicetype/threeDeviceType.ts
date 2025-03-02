import type { IPageQuery } from '@/api/interface'

export namespace IThreeDeviceType {

  // 查询条件
  export interface Query extends IPageQuery {
    effectiveHighVoltage?: number
    name?: string
  }

  // 编辑form表单
  export interface Form {
    id?: number
    effectiveHighVoltage?: number
    name?: string
  }

  // list或detail返回结构
  export interface Row {
    id?: number
    effectiveHighVoltage?: number
    name?: string
  }

  export interface Options {
    id: number
    name: string
    enableHighVoltage: boolean
  }

}