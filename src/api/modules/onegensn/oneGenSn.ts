import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/interface';
import type { IOneGenSn } from '@/api/interface/onegensn/oneGenSn';

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getOneGenSnListApi = (params: IOneGenSn.Query) => {
  return http.get<IPage<IOneGenSn.Row>>(ADMIN_MODULE + `/one-gen-sn`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const createOneGenSnApi = (params: IOneGenSn.Form) => {
  return http.post(ADMIN_MODULE + `/one-gen-sn`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const updateOneGenSnApi = (params: IOneGenSn.Form) => {
  return http.put(ADMIN_MODULE + `/one-gen-sn`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const removeOneGenSnApi = (params: { ids: (string | number)[] }) => {
  return http.delete(ADMIN_MODULE + `/one-gen-sn`, params);
};

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getOneGenSnDetailApi = (params: { id: number }) => {
  const { id } = params;
  return http.get<IOneGenSn.Row>(ADMIN_MODULE + `/one-gen-sn/${id}`);
};

/**
 *  生成条码
 * @param params  {categoryId: number, produceTime: string, num: number}
 * @returns  {*}
 */
export const printSnApi = (params: IOneGenSn.GenDto) => {
  return http.post(ADMIN_MODULE + `/one-gen-sn/gen`, params);
};
