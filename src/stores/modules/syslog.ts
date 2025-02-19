import mittBus from '@/utils/mittBus';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type SysLog = {
    id: number;
    createTime: string;
    level: "INFO" | "ERROR" | "WARN" | "DEBUG";
    metadata: string;
    msg: string;
    success: 0 | 1;
    cause: string;
}

export const useSysLogStore = defineStore('sys_log', () => {

    const logData = ref<SysLog[]>([]);

    const handleLogMessage = (data: any) => {
        logData.value.unshift(data);

        if (logData.value.length > 100) {
            logData.value = logData.value.filter((item, index) => {
                return !(index >= 100 && item.level === 'INFO');
            });
        }
    };

    mittBus.on('socket.SYS_LOG', handleLogMessage);

    return {
        logData
    };
});
