import type { IPageQuery } from '@/api/interface'

export namespace IArea {

  // 查询条件
  export interface Query extends IPageQuery {
    name?: string
    level?: string
    depth?: number
    code?: string
  }

  // 编辑form表单
  export interface Form {
    id?: string
    name?: string
    level?: string
    depth?: number
    parentId?: string
    code?: string
    center?: string
    $$seq$$?: number
    $$createAt$$?: number
    $$updateAt$$?: number
    $$deleteAt$$?: number
    $$triggerData$$?: string
    $$triggerUuid$$?: string
 }

  // list或detail返回结构
  export interface Row {
    id?: string
    name?: string
    level?: string
    depth?: number
    parentId?: string
    code?: string
    center?: string
    $$seq$$?: number
    $$createAt$$?: number
    $$updateAt$$?: number
    $$deleteAt$$?: number
    $$triggerData$$?: string
    $$triggerUuid$$?: string
  }

}