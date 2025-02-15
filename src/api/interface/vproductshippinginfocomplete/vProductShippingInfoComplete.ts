import type { IPageQuery } from '@/api/interface'

export namespace IVProductShippingInfoComplete {

  // 查询条件
  export interface Query extends IPageQuery {
    productName?: string
    productSku?: string
    productId?: number
    productSnCode?: string
    packingFormat?: string
    orderNumber?: string
    midBoxNumber?: string
    destination?: string
    destCodeId?: number
    palletNumber?: string
    factoryDateStart?: string
    factoryDateEnd?: string
    productionDateStart?: string
    productionDateEnd?: string
    destCode?: string
    totalShippingQuantity?: number
    totalPalletQuantity?: number
  }

  // 编辑form表单
  export interface Form {
    productName?: string
    productSku?: string
    productId?: number
    productSnCode?: string
    packingFormat?: string
    orderNumber?: string
    midBoxNumber?: string
    destination?: string
    destCodeId?: number
    palletNumber?: string
    factoryDate?: string
    productionDate?: string
    destCode?: string
    totalShippingQuantity?: number
    totalPalletQuantity?: number
 }

  // list或detail返回结构
  export interface Row {
    productName?: string
    productSku?: string
    productId?: number
    productSnCode?: string
    packingFormat?: string
    orderNumber?: string
    midBoxNumber?: string
    destination?: string
    destCodeId?: number
    palletNumber?: string
    factoryDate?: string
    productionDate?: string
    destCode?: string
    totalShippingQuantity?: number
    totalPalletQuantity?: number
  }

}