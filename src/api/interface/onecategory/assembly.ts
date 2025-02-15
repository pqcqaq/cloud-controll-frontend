import type { IPageQuery } from '@/api/interface';

export namespace IOneCategory {
  // 查询条件
  export interface Query extends IPageQuery {
    sku?: string;
    idCode?: number;
    name?: string;
  }

  // 编辑form表单
  export interface Form {
    id?: number;
    sku?: string;
    idCode?: number;
    name?: string;
    minWeight?: number;
    maxWeight?: number;
    midBoxNum?: number;
    palletNum?: number;
    needSn?: boolean;
    needWeigh?: boolean;
    needMidBox?: boolean;
    needPallet?: boolean;
    midBoxTemplateName?: string;
    palletTemplateName?: string;
    productTemplateName?: string;
    snTemplateName?: string;
    destTemplateName?: string;
    packingSpec?: string;
    grossWeight?: string;
    color?: string;
  }

  // list或detail返回结构
  export interface Row {
    id?: number;
    sku?: string;
    idCode?: number;
    name?: string;
    minWeight?: number;
    maxWeight?: number;
    midBoxNum?: number;
    palletNum?: number;
    needSn?: boolean;
    needWeigh?: boolean;
    needMidBox?: boolean;
    needPallet?: boolean;
    midBoxTemplateName?: string;
    palletTemplateName?: string;
    productTemplateName?: string;
    snTemplateName?: string;
    destTemplateName?: string;
    packingSpec?: string;
    grossWeight?: string;
    color?: string;
  }

  export interface CategoryLabelVo {
    id: number
    label: string
    idCode: number
  }
}
