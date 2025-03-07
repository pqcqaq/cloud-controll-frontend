// useRealTimeCollector.ts
import { ref } from 'vue';
import { useSocketIOStore } from '@/stores/modules/socketioClient';
import { getThreeCollectorDetailInfoApi } from '@/api/modules/threecollector/threeCollector';
import type { IThreeCollector } from '@/api/interface/threecollector/threeCollector';

export function useRealTimeCollector() {
  const collectorDetail = ref<IThreeCollector.DeviceData | null>(null);
  const socketIoStore = useSocketIOStore();
  let currentImei: string | null = null;

  const updateValueIfExist = (source: Record<string, any>, target: Record<string, any>) => {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        const element = target[key];
        if (element !== undefined && element !== null) {
          source[key] = element;
        }
      }
    }
  };

  const handleSub = (topic: string, data: any) => {
    if (!collectorDetail.value) return;

    if (topic.endsWith('pin')) {
      const pinDef = data.pinDef;
      if (collectorDetail.value.pins[pinDef - 1]) {
        updateValueIfExist(collectorDetail.value.pins[pinDef - 1], data);
      } else {
        collectorDetail.value.pins.push(data);
      }
    } else if (topic.endsWith('state')) {
      updateValueIfExist(collectorDetail.value.status, data);
    } else if (topic.endsWith('lock')) {
      collectorDetail.value.lockedInfo = data;
    } else if (topic.endsWith('unlock')) {
      collectorDetail.value.lockedInfo = '';
    } else if (topic.endsWith('online')) {
      collectorDetail.value.status.isOnline = true;
    } else if (topic.endsWith('offline')) {
      collectorDetail.value.status.isOnline = false;
    }
  };

  const sub = async (imei: string, id: number) => {
    unsub(); // 先取消之前的订阅
    currentImei = imei;
    socketIoStore.sub(`RTU/${imei}/#`, handleSub);
    try {
      const res = await getThreeCollectorDetailInfoApi({ id });
      collectorDetail.value = res.data;
    } catch (error) {
      console.error('获取采集器详情失败', error);
    }
  };

  const unsub = () => {
    if (currentImei) {
      socketIoStore.unsub(`RTU/${currentImei}/#`);
      currentImei = null;
    }
    collectorDetail.value = null;
  };

  return {
    collectorDetail,
    sub,
    unsub
  };
}
