import type { IPageQuery } from '@/api/interface';

export namespace IOneDestCode {
  // 查询条件
  export interface Query extends IPageQuery {
    code?: string;
    printed?: number;
  }

  // 编辑form表单
  export interface Form {
    id?: number;
    code?: string;
    printed?: number;
  }

  // list或detail返回结构
  export interface Row {
    id?: number;
    code?: string;
    printed?: number;
    address?: string;
  }
}
