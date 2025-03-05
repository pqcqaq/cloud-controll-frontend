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

function isTopicMatch(subscription: string, topic: string): boolean {
  const subParts = subscription.split('/');
  const topicParts = topic.split('/');

  if (subParts.length > topicParts.length && subParts[subParts.length - 1] !== '#') {
    return false;
  }

  for (let i = 0; i < subParts.length; i++) {
    if (subParts[i] === '#') {
      return true;
    }
    if (subParts[i] !== '+' && subParts[i] !== topicParts[i]) {
      return false;
    }
  }

  return subParts.length === topicParts.length;
}

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

  const _onOpen = () => {
    canReconnect.value = true;
    reconnectCount.value = 0;
  };

  const _onMessage = (event: any) => {
    console.log('socket.io message', event);
    if (event.topic && event.data) {
      handleIncomingMessage(event.topic, event.data);
    }
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

  type MsgCallBack = (data: any) => void;

  const subscriptions = ref<Map<string, ((data: any) => void)[]>>(new Map());

  const handleIncomingMessage = (topic: string, data: any) => {
    subscriptions.value.forEach((callbacks, subscription) => {
      if (isTopicMatch(subscription, topic)) {
        callbacks.forEach(callback => callback(data));
      }
    });
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
    socketIO.on('error', _onError);
    socketIO.on('close', _onClose);
    socketIO.connect();
    // // 连接时处理
    socket.value = socketIO;

    socket.value.onAny((event, ...args) => {
      _onMessage({ topic: event, data: args });
    });
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

    if (!subscriptions.value.has(userChannel)) {
      subscriptions.value.set(userChannel, []);
    }
    subscriptions.value.get(userChannel)!.push(callback);
  };

  const unsub = (channel: string, callback?: (data: any) => void) => {
    const userId = useUserStore().userInfo.id;
    const userChannel = `${userId}/${channel}`;
    socket.value?.emit('unsubscribe', userChannel);

    if (callback) {
      const callbacks = subscriptions.value.get(userChannel);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          subscriptions.value.delete(userChannel);
        }
      }
    } else {
      subscriptions.value.delete(userChannel);
    }
  };

  const psub = (channel: string, callback: (data: any) => void) => {
    socket.value?.emit('subscribe', channel);
    const userChannel = `#/${channel}`;

    if (!subscriptions.value.has(userChannel)) {
      subscriptions.value.set(userChannel, []);
    }
    subscriptions.value.get(userChannel)!.push(callback);
  };

  const punsub = (channel: string, callback?: (data: any) => void) => {
    socket.value?.emit('unsubscribe', channel);
    const userChannel = `#/${channel}`;

    if (callback) {
      const callbacks = subscriptions.value.get(userChannel);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          subscriptions.value.delete(userChannel);
        }
      }
    } else {
      subscriptions.value.delete(userChannel);
    }
  };

  return {
    open,
    close,
    sub,
    unsub,
    psub,
    punsub
  };
});
