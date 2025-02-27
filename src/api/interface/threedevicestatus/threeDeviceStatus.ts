import type { IPageQuery } from '@/api/interface'

export namespace IThreeDeviceStatus {

  // 查询条件
  export interface Query extends IPageQuery {
    collectorId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    collectorId?: number
    signalStrength?: number
    voltage?: number
    temperature?: number
    uptime?: number
    posLat?: number
    posLon?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    collectorId?: number
    signalStrength?: number
    voltage?: number
    temperature?: number
    uptime?: number
    posLat?: number
    posLon?: number
  }

}