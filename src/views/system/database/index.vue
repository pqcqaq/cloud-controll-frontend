<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="数据库备份记录"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="filename"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          type="primary"
          v-auth="'system.database.backup'"
          :icon="CirclePlus"
          @click="handleBackup"
        >
          立即备份
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :icon="Download"
          @click="downloadFile(row)"
        >
          下载
        </el-button>
        <el-button
          type="primary"
          link
          :icon="Delete"
          @click="deleteInfo(row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CirclePlus, Delete, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import { useHandleData } from '@/hooks/useHandleData';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import { ElButton, ElMessageBox } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
import type { IBackups } from '@/api/interface/database/backups';
import { backupApi, exportBackupsApi, getBackupsListApi, removeBackupsApi } from '@/api/modules/database/backups';
defineOptions({
  name: 'DatabaseBackupView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IBackups.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'filename', label: '文件名' },
  { prop: 'createAt', label: '备份时间' },
  { prop: 'fileSize', label: '文件大小' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  //   { prop: 'code', label: '目的地码', el: 'input' },
  //   { prop: 'printed', label: '是否打印', el: 'input' }
];
// 获取table列表
const getTableList = (params: IBackups.Query) => {
  let newParams = formatParams(params);
  return getBackupsListApi(newParams);
};
const formatParams = (params: IBackups.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
};
// 删除信息
const deleteInfo = async (params: IBackups.Row) => {
  await useHandleData(removeBackupsApi, { ids: [params.filename] }, `删除【${params.filename}】的备份记录`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeBackupsApi, { ids }, '删除所选数据库备份记录');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导出
const downloadFile = async (row: IBackups.Row) => {
  useDownload(exportBackupsApi, row.filename, {
    filename: row.filename
  });
};
const handleBackup = () => {
  backupApi().then(res => {
    ElMessageBox.alert('备份成功', '提示', {
      confirmButtonText: '确定',
      type: 'success'
    });
    proTableRef.value?.getTableList()
  });
};
</script>
