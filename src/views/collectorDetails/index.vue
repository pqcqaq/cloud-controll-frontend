<template>
  <div class="collector-details">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>采集器详情</span>
          <el-button type="primary" size="small" @click="fetchList" :icon="Refresh"> 刷新列表 </el-button>
        </div>
      </template>
      <div class="card-content">
        <el-select v-model="selectedCollector" placeholder="请选择采集器" class="collector-select">
          <el-option v-for="item in selections" :key="item.id" :label="item.imei" :value="item"> </el-option>
        </el-select>

        <div v-if="collectorDetail" class="detail-section">
          <h3>基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="ID">{{ collectorDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="IMEI">{{ collectorDetail.imei }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{ collectorDetail.deviceType.name }}</el-descriptions-item>
            <el-descriptions-item label="高电平有效">{{
              collectorDetail.deviceType.effectiveHighVoltage ? '是' : '否'
            }}</el-descriptions-item>
          </el-descriptions>

          <h3>状态信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="信号强度">{{ collectorDetail.status.signalStrength }} dBm</el-descriptions-item>
            <el-descriptions-item label="电压">{{ collectorDetail.status.voltage.toFixed(2) }} V</el-descriptions-item>
            <el-descriptions-item label="温度">{{ collectorDetail.status.temperature.toFixed(1) }} °C</el-descriptions-item>
            <el-descriptions-item label="运行时间"
              >{{ collectorDetail.status.uptime }} 秒</el-descriptions-item
            >
            <el-descriptions-item label="纬度">{{ collectorDetail.status.posLat.toFixed(6) }}</el-descriptions-item>
            <el-descriptions-item label="经度">{{ collectorDetail.status.posLon.toFixed(6) }}</el-descriptions-item>
            <el-descriptions-item label="在线状态">
              <el-tag :type="collectorDetail.status.isOnline ? 'success' : 'danger'">
                {{ collectorDetail.status.isOnline ? '在线' : '离线' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ collectorDetail.status.updateTime }}</el-descriptions-item>
          </el-descriptions>

          <h3>引脚状态</h3>
          <el-table :data="collectorDetail.pins" border style="width: 100%">
            <el-table-column prop="pinDef" label="引脚" width="80" />
            <el-table-column prop="counts" label="计数" width="80" />
            <el-table-column prop="triggerTime" label="触发时间" />
            <el-table-column prop="uptime" label="运行时间" :formatter="formatUptime" />
            <el-table-column prop="active" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'info'">
                  {{ scope.row.active ? '激活' : '未激活' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import type { IThreeCollector } from '@/api/interface/threecollector/threeCollector';
import { getMyCollectorsApi, getThreeCollectorDetailApi } from '@/api/modules/threecollector/threeCollector';
import { useSocketIOStore } from '@/stores/modules/socketioClient';

const selections = ref<IThreeCollector.Selection[]>([]);
const selectedCollector = ref<IThreeCollector.Selection | null>(null);
const collectorDetail = ref<IThreeCollector.DeviceData | null>(null);

const socketIoStore = useSocketIOStore();

const fetchList = async () => {
  try {
    const res = await getMyCollectorsApi();
    selections.value = res.data;
  } catch (error) {
    ElMessage.error('获取采集器列表失败');
  }
};

const getDetails = async () => {
  if (selectedCollector.value) {
    try {
      const res = await getThreeCollectorDetailApi({ id: selectedCollector.value.id });
      collectorDetail.value = res.data;
    } catch (error) {
      ElMessage.error('获取采集器详情失败');
    }
  }
};

const handleSub = (data: any) => {
  getDetails();
};

const formatUptime = (row: any) => {
  return `${(row.uptime / 3600).toFixed(2)} 小时`;
};

onMounted(() => {
  fetchList();
});

watch(
  () => selectedCollector.value,
  (newVal, oldVal) => {
    if (oldVal) {
      socketIoStore.unsub(`RTU/${oldVal.imei}/#`);
    }
    if (newVal) {
      socketIoStore.sub(`RTU/${newVal.imei}/#`, handleSub);
      getDetails();
    }
  }
);
</script>

<style scoped>
.collector-details {
  max-width: 800px;
  margin: 0 auto;
}

.box-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 20px 0;
}

.collector-select {
  width: 100%;
  margin-bottom: 20px;
}

.detail-section {
  margin-top: 20px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
