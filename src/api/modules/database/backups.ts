import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/interface';
import type { IBackups } from '@/api/interface/database/backups';

/**
 * 查询列表
 * @param params
 * @returns {*}
 */
export const getBackupsListApi = (params: IBackups.Query) => {
  return http.get<IPage<IBackups.Row>>(ADMIN_MODULE + `/database`, params);
};

/**
 * 删除
 */
export const removeBackupsApi = (params: { ids: (string | number)[] }) => {
    return http.delete(ADMIN_MODULE + `/database`, params);
}

/**
 * 备份
 */
export const backupApi = () => {
    return http.post(ADMIN_MODULE + `/database/backup`);
}

/**
 * 导出
 */
export const exportBackupsApi = (params: IBackups.Query) => {
    return http.download(ADMIN_MODULE + `/database/export`, params);
}