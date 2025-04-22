<template>
  <div class="table-box">
    <ProTable
      ref="proTableRef"
      title="采集器管理"
      :indent="20"
      :columns="columns"
      :search-columns="searchColumns"
      :request-api="getTableList"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!-- <el-button type="primary" v-auth="'three.collector.create'" :icon="CirclePlus" @click="openAddEdit('新增采集器管理')">
          新增
        </el-button> -->
        <el-button
          v-auth="'three.collector.remove'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
        <!-- <el-button v-auth="'three.collector.import'" type="primary" :icon="Upload" plain @click="importData"> 导入 </el-button> -->
        <el-button v-auth="'three.collector.export'" type="primary" :icon="Download" plain @click="downloadFile">
          导出
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          v-auth="'three.collector.update'"
          type="primary"
          link
          :icon="EditPen"
          @click="openAddEdit('编辑采集器管理', row, false)"
        >
          编辑
        </el-button>
        <el-button v-auth="'three.collector.remove'" type="primary" link :icon="Delete" @click="deleteInfo(row)">
          删除
        </el-button>
        <!-- 上锁按钮 -->
        <el-button v-auth="'three.collector.lock'" type="primary" link :icon="Lock" @click="lockInfo(row)"> 上锁 </el-button>
        <!-- 解锁按钮 -->
        <el-button v-auth="'three.collector.unlock'" type="primary" link :icon="Unlock" @click="unlockInfo(row)">
          解锁
        </el-button>
        <!-- 发送更新 -->
        <el-button v-auth="'three.collector.sendUpdate'" type="primary" link :icon="Download" @click="sendUpdate(row)">
          发送更新
        </el-button>
        <!-- 更新未知 -->
        <el-button type="primary" link :icon="Download" @click="sendUpdateLocation(row)">
          更新位置
        </el-button>
        <!-- reboot -->
        <el-button v-auth="'three.collector.reboot'" type="primary" link :icon="Download" @click="rebootInfo(row)">
          重启
        </el-button>
        <!-- 升级 -->
        <el-button type="primary" link :icon="Download" @click="UpgradeFormRef?.open(row)"> 升级 </el-button>
      </template>
    </ProTable>
    <ThreeCollectorForm ref="threeCollectorRef" />
    <ImportExcel ref="ImportExcelRef" />
    <UpgradeForm ref="UpgradeFormRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CirclePlus, Delete, EditPen, Upload, Download } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import {
  createThreeCollectorApi,
  removeThreeCollectorApi,
  updateThreeCollectorApi,
  getThreeCollectorListApi,
  getThreeCollectorDetailApi,
  importThreeCollectorExcelApi,
  exportThreeCollectorExcelApi,
  sendLockMsgApi,
  sendUnlockMsgApi,
  sendUpdateMsgApi,
  sendRestartMsgApi,
  updateLocation
} from '@/api/modules/threecollector/threeCollector';
import { useHandleData } from '@/hooks/useHandleData';
import ThreeCollectorForm from '@/views/threecollector/threeCollector/components/ThreeCollectorForm.vue';
import type { ColumnProps, ProTableInstance, SearchProps } from '@/components/ProTable/interface';
import type { IThreeCollector } from '@/api/interface/threecollector/threeCollector';
import ImportExcel from '@/components/ImportExcel/index.vue';
import { downloadTemplate } from '@/api/modules/system/common';
import { ElMessageBox } from 'element-plus';
import { useDownload } from '@/hooks/useDownload';
import { Lock, Unlock } from '@element-plus/icons-vue';
import { getThreeDeviceTypeOptionsApi } from '@/api/modules/threedevicetype/threeDeviceType';
import UpgradeForm from './components/UpgradeForm.vue';
import { useSocketIOStore } from '@/stores/modules/socketioClient';

const UpgradeFormRef = ref<InstanceType<typeof UpgradeForm>>();

defineOptions({
  name: 'ThreeCollectorView'
});

const getOptionsList = () => {
  getThreeDeviceTypeOptionsApi().then(res => {
    searchColumns[1].enum = res.data.map(item => ({
      label: `${item.name}/${item.enableHighVoltage ? 'high' : 'low'}`,
      value: item.id
    }));
  });
};

onMounted(() => {
  getOptionsList();
});
const proTableRef = ref<ProTableInstance>();
// 表格配置项
const columns: ColumnProps<IThreeCollector.Row>[] = [
  { type: 'selection', width: 80 },
  { prop: 'imei', label: '唯一标识' },
  { prop: 'diScanGap', label: 'DI扫描间隔' },
  { prop: 'stateCallbackGap', label: '状态回传间隔' },
  { prop: 'lockOnStartup', label: '初始状态是否锁机' },
  // ntpTimeCalibrationGap
  {
    prop: 'ntpTimeCalibrationGap',
    label: 'NTP时间校准间隔'
  },
  // locationTimeGap
  {
    prop: 'locationTimeGap',
    label: '定位时间间隔'
  },
  // keepaliveGap
  {
    prop: 'keepaliveGap',
    label: '心跳间隔'
  },
  { prop: 'deviceTypeId', label: '设备类型' },
  { prop: 'version', label: '固件版本' },
  { prop: 'weakSignal', label: '弱信号阈值' },
  { prop: 'lowVoltage', label: '低电压阈值' },
  { prop: 'highVoltage', label: '高电压阈值' },
  { prop: 'lowTemperature', label: '低温度阈值' },
  { prop: 'highTemperature', label: '高温度阈值' },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
];
// 搜索条件项
const searchColumns: SearchProps[] = reactive<SearchProps[]>([
  { prop: 'imei', label: '唯一标识', el: 'input' },
  {
    prop: 'deviceTypeId',
    label: '设备类型',
    el: 'select'
  }
]);
// 获取table列表
const getTableList = (params: IThreeCollector.Query) => {
  let newParams = formatParams(params);
  return getThreeCollectorListApi(newParams);
};
const formatParams = (params: IThreeCollector.Query) => {
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
const threeCollectorRef = ref<InstanceType<typeof ThreeCollectorForm>>();
const openAddEdit = async (title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getThreeCollectorDetailApi({ id: row?.id });
    row = record?.data;
  }
  const params = {
    title,
    row: { ...row },
    api: isAdd ? createThreeCollectorApi : updateThreeCollectorApi,
    getTableList: proTableRef.value?.getTableList
  };
  threeCollectorRef.value?.acceptParams(params);
};
// 删除信息
const deleteInfo = async (params: IThreeCollector.Row) => {
  await useHandleData(removeThreeCollectorApi, { ids: [params.id] }, `删除【${params.id}】采集器管理`);
  proTableRef.value?.getTableList();
};
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeThreeCollectorApi, { ids }, '删除所选采集器管理');
  proTableRef.value?.clearSelection();
  proTableRef.value?.getTableList();
};
// 导入
const ImportExcelRef = ref<InstanceType<typeof ImportExcel>>();
const importData = () => {
  const params = {
    title: '采集器管理',
    templateName: '采集器管理',
    tempApi: downloadTemplate,
    importApi: importThreeCollectorExcelApi,
    getTableList: proTableRef.value?.getTableList
  };
  ImportExcelRef.value?.acceptParams(params);
};
// 导出
const downloadFile = async () => {
  let newParams = formatParams(proTableRef.value?.searchParam as IThreeCollector.Query);
  useDownload(exportThreeCollectorExcelApi, '采集器管理', newParams);
};

const lockInfo = async (params: IThreeCollector.Row) => {
  const res = await ElMessageBox.confirm('确定要上锁吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  if (res === 'confirm') {
    await sendLockMsgApi({ id: params.id! }).then(() => {
      ElMessageBox.alert('上锁成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      });
    });
    proTableRef.value?.getTableList();
  }
};

const unlockInfo = async (params: IThreeCollector.Row) => {
  const res = await ElMessageBox.confirm('确定要解锁吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  if (res === 'confirm') {
    await sendUnlockMsgApi({ id: params.id! }).then(() => {
      ElMessageBox.alert('解锁成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      });
    });
    proTableRef.value?.getTableList();
  }
};

const sendUpdate = async (params: IThreeCollector.Row) => {
  const res = await ElMessageBox.confirm('确定要发送更新吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  if (res === 'confirm') {
    await sendUpdateMsgApi({ id: params.id! }).then(() => {
      ElMessageBox.alert('发送更新成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      });
    });
    proTableRef.value?.getTableList();
  }
};

const sendUpdateLocation = async (params: IThreeCollector.Row) => {
    const res = await ElMessageBox.confirm('确定要重新获取位置吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  if (res === 'confirm') {
    await updateLocation(params.id!).then(() => {
      ElMessageBox.alert('发送更新成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      });
    });
    proTableRef.value?.getTableList();
  }
}

const rebootInfo = async (params: IThreeCollector.Row) => {
  const res = await ElMessageBox.confirm('确定要重启吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  if (res === 'confirm') {
    await sendRestartMsgApi({ id: params.id! }).then(() => {
      ElMessageBox.alert('重启成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      });
    });
    proTableRef.value?.getTableList();
  }
};
</script>
