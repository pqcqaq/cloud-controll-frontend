import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/interface';
import type { IOneAssemblyLine } from '@/api/interface/oneassemblyline/oneAssemblyLine';
import type { UploadRawFile } from 'element-plus/es/components/upload/src/upload';
import type { AxiosRequestConfig } from 'axios';

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getOneAssemblyLineListApi = (params: IOneAssemblyLine.Query) => {
  return http.get<IPage<IOneAssemblyLine.Row>>(ADMIN_MODULE + `/one-assembly-line`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const createOneAssemblyLineApi = (params: IOneAssemblyLine.Form) => {
  return http.post(ADMIN_MODULE + `/one-assembly-line`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const updateOneAssemblyLineApi = (params: IOneAssemblyLine.Form) => {
  return http.put(ADMIN_MODULE + `/one-assembly-line`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const removeOneAssemblyLineApi = (params: { ids: (string | number)[] }) => {
  return http.delete(ADMIN_MODULE + `/one-assembly-line`, params);
};

/**
 * 获取详情
 * @param params
 * @returns {*}
 */
export const getOneAssemblyLineDetailApi = (params: { id: number }) => {
  const { id } = params;
  return http.get<IOneAssemblyLine.Row>(ADMIN_MODULE + `/one-assembly-line/${id}`);
};

/**
 * 导入excel
 * @param params
 */
export const importOneAssemblyLineExcelApi = (params: UploadRawFile, config?: AxiosRequestConfig<{}> | undefined) => {
  return http.upload(ADMIN_MODULE + `/one-assembly-line/import`, params, config);
};

/**
 * 导出excel
 * @param params
 * @returns {*}
 */
export const exportOneAssemblyLineExcelApi = (params: IOneAssemblyLine.Query) => {
  return http.download(ADMIN_MODULE + `/one-assembly-line/export`, params);
};

/**
 * 抓取所有的产线信息列表（可能有性能问题，需谨慎）
 */
export const getOneAssemblyLineSelectionApi = (params?: { categoryId: number }) => {
  return http.get<IOneAssemblyLine.Selection[]>(ADMIN_MODULE + `/one-assembly-line/selection`, params);
};

/**
 * 获取模板文件信息
 * @param params
 * @returns {*}
 */
export const getTemplateFileInfoApi = (params: { id: number }) => {
  const { id } = params;
  return http.get<IOneAssemblyLine.TemplateFileInfo>(ADMIN_MODULE + `/one-assembly-line/template-file-info/${id}`);
};
