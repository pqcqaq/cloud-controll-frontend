import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/interface';
import type { IOnePallet } from '@/api/interface/onepallet/one';
import type { UploadRawFile } from 'element-plus/es/components/upload/src/upload';
import type { AxiosRequestConfig } from 'axios';

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getOnePalletListApi = (params: IOnePallet.Query) => {
  return http.get<IPage<IOnePallet.Row>>(ADMIN_MODULE + `/one-pallet`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const createOnePalletApi = (params: IOnePallet.Form) => {
  return http.post(ADMIN_MODULE + `/one-pallet`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const updateOnePalletApi = (params: IOnePallet.Form) => {
  return http.put(ADMIN_MODULE + `/one-pallet`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const removeOnePalletApi = (params: { ids: (string | number)[] }) => {
  return http.delete(ADMIN_MODULE + `/one-pallet`, params);
};

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getOnePalletDetailApi = (params: { id: number }) => {
  const { id } = params;
  return http.get<IOnePallet.Row>(ADMIN_MODULE + `/one-pallet/${id}`);
};

/**
 * 导入excel
 * @param params
 */
export const importOnePalletExcelApi = (params: UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-pallet/import`, params, config);
};

/**
 * 导出excel
 * @param params
 * @returns {*}
 */
export const exportOnePalletExcelApi = (params: IOnePallet.Query) => {
  return http.download(ADMIN_MODULE + `/one-pallet/export`, params);
};

/**
 * 补打栈板码
 */

export const reprintPalletCodeApi = (params: { code: string }) => {
  return http.post(ADMIN_MODULE + `/one-pallet/reprint-pallet-code`, params);
};
