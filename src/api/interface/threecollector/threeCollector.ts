import type { IPageQuery } from '@/api/interface'

export namespace IThreeCollector {

  // 查询条件
  export interface Query extends IPageQuery {
    imei?: string
    deviceTypeId?: number
  }

  // 编辑form表单
  export interface Form {
    id?: number
    imei?: string
    diScanGap?: number
    stateCallbackGap?: number
    lockOnStartup?: number
    deviceTypeId?: number
 }

  // list或detail返回结构
  export interface Row {
    id?: number
    imei?: string
    diScanGap?: number
    stateCallbackGap?: number
    lockOnStartup?: number
    deviceTypeId?: number
  }

  export interface DeviceData {
    id: number;
    imei: string;
    diScanGap: number;
    stateCallbackGap: number;
    lockOnStartup: boolean;
    ntpTimeCalibrationGap: number;
    locationTimeGap: number;
    keepaliveGap: number;
    deviceType: {
      effectiveHighVoltage: boolean;
      name: string;
    };
    status: {
      signalStrength: number;
      voltage: number;
      temperature: number;
      uptime: number;
      posLat: number;
      posLon: number;
      isOnline: boolean;
      updateTime: string;
    };
    lockedInfo: {
      lockedTime: string;
      unlockTime: string;
      status: string;
    } | "";
    pins: Array<{
      pinDef: number;
      counts: number;
      triggerTime: string;
      uptime: number;
      active: boolean;
      updateTime: string;
    }>;
  }
  

  export interface Selection {
    id: number
    imei: string
  }

}