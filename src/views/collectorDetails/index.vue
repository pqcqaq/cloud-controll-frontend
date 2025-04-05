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
        <div v-if="collectorDetail" class="action-buttons">
          <el-button v-auth="'three.collector.lock'" type="primary" :icon="Lock" @click="lockInfo(collectorDetail)">
            上锁
          </el-button>
          <el-button v-auth="'three.collector.unlock'" type="primary" :icon="Unlock" @click="unlockInfo(collectorDetail)">
            解锁
          </el-button>
          <el-button v-auth="'three.collector.sendUpdate'" type="primary" :icon="Download" @click="sendUpdate(collectorDetail)">
            发送更新
          </el-button>
          <el-button v-auth="'three.collector.reboot'" type="primary" :icon="Refresh" @click="rebootInfo(collectorDetail)">
            重启
          </el-button>
        </div>

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

          <template v-if="collectorDetail.status">
            <h3>状态信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="信号强度">{{ collectorDetail.status.signalStrength }} dBm</el-descriptions-item>
              <el-descriptions-item label="电压">{{ collectorDetail.status.voltage.toFixed(2) }} V</el-descriptions-item>
              <el-descriptions-item label="温度">{{ collectorDetail.status.temperature.toFixed(1) }} °C</el-descriptions-item>
              <el-descriptions-item label="运行时间">{{ collectorDetail.status.uptime.toFixed(2) }} 秒</el-descriptions-item>
              <el-descriptions-item label="纬度">{{ collectorDetail.status.posLat }}</el-descriptions-item>
              <el-descriptions-item label="经度">{{ collectorDetail.status.posLon }}</el-descriptions-item>
              <el-descriptions-item label="在线状态">
                <el-tag :type="collectorDetail.status.isOnline ? 'success' : 'danger'">
                  {{ collectorDetail.status.isOnline ? '在线' : '离线' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ collectorDetail.status.updateTime }}</el-descriptions-item>
            </el-descriptions>
          </template>
          <template v-else>
            <h3>状态信息获取失败</h3>
          </template>

          <!-- 锁机状态 -->
          <h3>锁机状态</h3>
          <el-descriptions :column="2" border v-if="collectorDetail.lockedInfo">
            <el-descriptions-item label="锁机状态">
              <el-tag :type="collectorDetail.lockedInfo.status === 'LOCKED' ? 'success' : 'info'">
                {{ collectorDetail.lockedInfo.status === 'LOCKED' ? '已锁机' : '未锁机' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="锁机时间">{{ collectorDetail.lockedInfo.lockedTime }}</el-descriptions-item>
            <el-descriptions-item label="解锁时间">{{ collectorDetail.lockedInfo.unlockTime }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions :column="2" border v-else>
            <el-descriptions-item label="锁机状态">
              <el-tag type="info">未锁机</el-tag>
            </el-descriptions-item>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import type { IThreeCollector } from '@/api/interface/threecollector/threeCollector';
import {
  getMyCollectorsApi,
  sendLockMsgApi,
  sendRestartMsgApi,
  sendUnlockMsgApi,
  sendUpdateMsgApi
} from '@/api/modules/threecollector/threeCollector';
import { Refresh, Lock, Unlock, Download } from '@element-plus/icons-vue';
import { useRealTimeCollector } from '@/utils/useRealTimeCollector';

const selections = ref<IThreeCollector.Selection[]>([]);
const selectedCollector = ref<IThreeCollector.Selection | null>(null);

const { collectorDetail, sub, unsub } = useRealTimeCollector();

const formatUptime = (row: any) => {
  return `${(row.uptime / 3600).toFixed(2)} 小时`;
};

const fetchList = async () => {
  try {
    const res = await getMyCollectorsApi();
    selections.value = res.data;
  } catch (error) {
    ElMessage.error('获取采集器列表失败');
  }
};

onMounted(() => {
  fetchList();
});

watch(
  () => selectedCollector.value,
  (newVal, oldVal) => {
    if (oldVal) {
      unsub();
    }
    if (newVal) {
      sub(newVal.imei, newVal.id);
    }
  }
);

const lockInfo = async (params: IThreeCollector.DeviceData) => {
  try {
    await ElMessageBox.confirm('确定要上锁吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await sendLockMsgApi({ id: params.id });
    ElMessage.success('上锁成功');
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('上锁失败');
  }
};

const unlockInfo = async (params: IThreeCollector.DeviceData) => {
  try {
    await ElMessageBox.confirm('确定要解锁吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await sendUnlockMsgApi({ id: params.id });
    ElMessage.success('解锁成功');
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('解锁失败');
  }
};

const sendUpdate = async (params: IThreeCollector.DeviceData) => {
  try {
    await ElMessageBox.confirm('确定要发送更新吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await sendUpdateMsgApi({ id: params.id });
    ElMessage.success('发送更新成功');
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('发送更新失败');
  }
};

const rebootInfo = async (params: IThreeCollector.DeviceData) => {
  try {
    await ElMessageBox.confirm('确定要重启吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await sendRestartMsgApi({ id: params.id });
    ElMessage.success('重启成功');
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('重启失败');
  }
};
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

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.action-buttons .el-button {
  margin: 0 10px;
}
</style>
