import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/interface';
import type { IOneDestCode } from '@/api/interface/onedestcode/oneDestCode';
import type { UploadRawFile } from 'element-plus/es/components/upload/src/upload';
import type { AxiosRequestConfig } from 'axios';

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getOneDestCodeListApi = (params: IOneDestCode.Query) => {
  return http.get<IPage<IOneDestCode.Row>>(ADMIN_MODULE + `/one-dest-code`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const createOneDestCodeApi = (params: IOneDestCode.Form) => {
  return http.post(ADMIN_MODULE + `/one-dest-code`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const updateOneDestCodeApi = (params: IOneDestCode.Form) => {
  return http.put(ADMIN_MODULE + `/one-dest-code`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const removeOneDestCodeApi = (params: { ids: (string | number)[] }) => {
  return http.delete(ADMIN_MODULE + `/one-dest-code`, params);
};

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getOneDestCodeDetailApi = (params: { id: number }) => {
  const { id } = params;
  return http.get<IOneDestCode.Row>(ADMIN_MODULE + `/one-dest-code/${id}`);
};

/**
 * 导入excel
 * @param params
 */
export const importOneDestCodeExcelApi = (params: UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-dest-code/import`, params, config);
};

/**
 * 导出excel
 * @param params
 * @returns {*}
 */
export const exportOneDestCodeExcelApi = (params: IOneDestCode.Query) => {
  return http.download(ADMIN_MODULE + `/one-dest-code/export`, params);
};

/**
 * 补打
 */
export const reprintOneDestCodeApi = (params: { id: number }) => {
  return http.post(ADMIN_MODULE + `/one-dest-code/reprint`, params, { loading: true });
};
