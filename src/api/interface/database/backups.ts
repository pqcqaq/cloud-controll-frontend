import type { IPageQuery } from '@/api/interface';

export namespace IBackups {
  export interface Query extends IPageQuery {
    code?: string;
    printed?: number;
  }

  // list或detail返回结构
  export interface Row {
    filename: string;
    createAt: string;
    fileSize: string;
  }
}
