import { useUserStore } from '@/stores/modules/user';
import { defineStore } from 'pinia';
import mittBus from '@/utils/mittBus';
import { CHANNEL_DEFAULT, CHANNEL_KICK_OFF, UPGRADE_CHANNEL } from '@/config/consts';
import { ref } from 'vue';
import { io, Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client';

// 是否使用socket 当 import.meta.env.VITE_SOCKET_URL 不为空时，启用websocket
//const useSocket = Object.prototype.hasOwnProperty.call(import.meta.env, 'VITE_SOCKET_URL');
const useSocketIO = Object.hasOwn(import.meta.env, 'VITE_SOCKET_IO_URL');
const socketIOUrl = new URL(import.meta.env.VITE_SOCKET_IO_URL, window.location.origin);
socketIOUrl.protocol = socketIOUrl.protocol === 'https:' ? 'https:' : 'http:';
const MAX_RECONNECT_COUNT = 10;

/**
 * 使用socket
 * @param url
 * @returns {{init: (function(): void), socket: null}}
 */
export const useSocketIOStore = defineStore('socket-io', () => {
  /**
   * 定义socket变量
   *
   * @type {Socket|null}
   */
  const socket = ref<Socket | null>(null);

  const canReconnect = ref(true);

  const reconnectCount = ref(0);

  const subedList = ref<string[]>([]);

  const _onOpen = () => {
    canReconnect.value = true;
    reconnectCount.value = 0;
  };

  const _onMessage = (event: any) => {
    console.log('socket.io message', event);
    mittBus.emit('socket.io.message', event);
  };

  const _onError = (event: Event) => {
    mittBus.emit('socket.io.error', event);
  };

  const _onClose = () => {
    socket.value = null;
    if (canReconnect.value) {
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    let timeout;
    if (reconnectCount.value < MAX_RECONNECT_COUNT) {
      timeout = Math.min(10000 * Math.pow(2, reconnectCount.value), 30000); // 指数退避算法
    } else {
      timeout = 60000; // 超过最大次数次后，每分钟重试一次
    }
    setTimeout(() => {
      reconnectCount.value++;
      open();
    }, timeout);
  };

  /**
   * 初始化开启socket
   */
  const open = () => {
    if (!useSocketIO) return;
    if (socket.value) return;
    const userStore = useUserStore();
    // 建立WebSocket连接
    const conn = socketIOUrl.pathname;
    const socketIOConfig: Partial<ManagerOptions & SocketOptions> = {
      path: conn,
      query: {
        token: userStore.token
      },
      autoConnect: false,
      transports: ['websocket'] // 强制使用 WebSocket
    };
    const socketIO = io(socketIOConfig);
    socketIO.on('open', _onOpen);
    socketIO.on('message', _onMessage);
    socketIO.on('error', _onError);
    socketIO.on('close', _onClose);
    socketIO.connect();
    // // 连接时处理
    socket.value = socketIO;
  };

  /**
   * 关闭socket
   */
  const close = () => {
    if (!useSocketIO) return;
    if (!socket.value) return;
    canReconnect.value = false;
    reconnectCount.value = 0;
    socket.value.close();
    socket.value = null;
  };

  const sub = (channel: string, callback: (data: any) => void) => {
    const userId = useUserStore().userInfo.id;
    const userChannel = `${userId}/${channel}`;
    socket.value?.emit('subscribe', userChannel);
    subedList.value.push(userChannel);
    socket.value?.on(userChannel, callback);
  };

  const unsub = (channel: string, callback?: (data: any) => void) => {
    const userId = useUserStore().userInfo.id;
    const userChannel = `${userId}/${channel}`;
    socket.value?.emit('unsubscribe', userChannel);
    subedList.value = subedList.value.filter(item => item !== userChannel);
    socket.value?.off(userChannel, callback);
  };

  const psub = (channel: string, callback: (data: any) => void) => {
    socket.value?.emit('subscribe', channel);
    subedList.value.push(channel);
    socket.value?.on(channel, callback);
  };

  const punsub = (channel: string, callback?: (data: any) => void) => {
    socket.value?.emit('unsubscribe', channel);
    subedList.value = subedList.value.filter(item => item !== channel);
    socket.value?.off(channel, callback);
  };

  return {
    open,
    close,
    sub,
    unsub,
    psub,
    punsub,
  };
});
