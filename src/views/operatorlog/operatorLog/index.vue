<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="系统日志"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-auth="'operator.log.create'" :icon="CirclePlus" @click="openAddEdit('新增系统日志')">
          新增
        </el-button>
        <el-button
          v-auth="'operator.log.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button v-auth="'operator.log.export'" type="primary" :icon="Download" plain @click="downloadFile"> 导出 </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'operator.log.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑系统日志', row, false)"
        >
          编辑
        </el-button>
        <el-button v-auth="'operator.log.remove'" type="primary" link :icon="Delete" @click="deleteInfo(row)"> 删除 </el-button>
      </template>
    </ProTable>
    <OperatorLogForm ref="operatorLogRef" />
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createOperatorLogApi,
  removeOperatorLogApi,
  updateOperatorLogApi,
  getOperatorLogListApi,
  getOperatorLogDetailApi,
  exportOperatorLogExcelApi
} from '@/api/modules/operatorlog/operatorLog';
import { useHandleData } from '@/hooks/useHandleData';
import OperatorLogForm from '@/views/operatorlog/operatorLog/components/OperatorLogForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IOperatorLog } from '@/api/interface/operatorlog/operatorLog';
import { ElMessageBox, ElTag } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
import mittBus from '@/utils/mittBus';
defineOptions({
  name: 'OperatorLogView'
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IOperatorLog.Row>[] = [
  { type: 'selection', width: 80 },
  {
    prop: 'level',
    label: '日志等级',
    render: ({ row }) => {
      return h(ElTag, { type: row.level === 'INFO' ? 'success' : row.level === 'ERROR' ? 'danger' : 'warning' }, () => row.level);
    }
  },
  { prop: 'msg', label: '消息' },
  { prop: 'success', label: '是否成功' },
  { prop: 'cause', label: '失败原因' },
  { prop: 'metadata', label: '元数据' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = [
  {
    prop: 'level',
    label: '日志等级',
    el: 'select',
    enum: [
      {
        label: 'INFO',
        value: 'INFO'
      },
      {
        label: 'ERROR',
        value: 'ERROR'
      },
      {
        label: 'WARN',
        value: 'WARN'
      }
      // {
      //   label: "DEBUG",
      //   value: "DEBUG"
      // },
      // {
      //   label: "TRACE",
      //   value: "TRACE"
      // },
      // {
      //   label: "FATAL",
      //   value: "FATAL"
      // }
    ]
  },
  { prop: 'msg', label: '消息', el: 'input' },
  { prop: 'success', label: '是否成功', el: 'select' },
  { prop: 'cause', label: '失败原因', el: 'input' }
];
// 获取table列表
const getTableList = (params: IOperatorLog.Query) => {
  let newParams = formatParams(params);
  return getOperatorLogListApi(newParams);
};
const formatParams = (params: IOperatorLog.Query) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.createTimeStart = newParams.createTime[0]);
  newParams.createTime && (newParams.createTimeEnd = newParams.createTime[1]);
  delete newParams.createTime;
  newParams.updateTime && (newParams.updateTimeStart = newParams.updateTime[0]);
  newParams.updateTime && (newParams.updateTimeEnd = newParams.updateTime[1]);
  delete newParams.updateTime;
  return newParams;
};
// 打开 drawer(新增、查看、编辑)
const operatorLogRef = ref<InstanceType<typeof OperatorLogForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getOperatorLogDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createOperatorLogApi : updateOperatorLogApi,
    getTableList: proTableRef.value?.getTableList
  };
  operatorLogRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IOperatorLog.Row) => {
  await useHandleData(removeOperatorLogApi, { ids: [params.id] }, `删除【${params.id}】系统日志`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeOperatorLogApi, { ids }, '删除所选系统日志');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IOperatorLog.Query);
  useDownload(exportOperatorLogExcelApi, '系统日志', newParams);
};

const handleNewLog = (data: any) => {
  // 如果在没有选择的情况下，何时都刷新，否则只当LOG级别相同时，刷新列表
  if (!proTableRef.value) return;
  if (!proTableRef.value?.searchParam.level) {
    proTableRef.value?.getTableList();
    return;
  }
  if (data.level === proTableRef.value?.searchParam.level) {
    proTableRef.value?.getTableList();
  }
};

onMounted(() => {
  mittBus.on('socket.SYS_LOG', handleNewLog);
});
</script>
