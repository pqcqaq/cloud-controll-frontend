import { useUserStore } from '@/stores/modules/user';
import { defineStore } from 'pinia';
import mittBus from '@/utils/mittBus';
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
    // 启动完成重新订阅之前订阅过的频道
    subscriptions.value.forEach((callbacks, subscription) => {
      socket.value?.emit('subscribe', subscription);
    });
  };

  const _onMessage = (event: any) => {
    if (event.topic && event.data) {
      handleIncomingMessage(event.topic, event.data);
    }
  };

  const _onError = (event: Error) => {
    mittBus.emit('socket.io.error', event);
  };

  // const _onClose = () => {
  //   socket.value = null;
  //   if (canReconnect.value) {
  //     handleReconnect();
  //   }
  // };

  // const handleReconnect = () => {
  //   let timeout;
  //   if (reconnectCount.value < MAX_RECONNECT_COUNT) {
  //     timeout = Math.min(10000 * Math.pow(2, reconnectCount.value), 30000); // 指数退避算法
  //   } else {
  //     timeout = 60000; // 超过最大次数次后，每分钟重试一次
  //   }
  //   setTimeout(() => {
  //     reconnectCount.value++;
  //     open();
  //   }, timeout);
  // };

  const subscriptions = ref<Map<string, ((topic: string, data: any) => void)[]>>(new Map());

  const handleIncomingMessage = (topic: string, data: any) => {
    subscriptions.value.forEach((callbacks, subscription) => {
      if (isTopicMatch(subscription, topic)) {
        callbacks.forEach(callback => callback(topic, data));
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
    socketIO.on('connect', _onOpen);
    socketIO.on('connect_error', _onError);
    // socketIO.on('disconnect', _onClose);
    socketIO.connect();
    // // 连接时处理
    socket.value = socketIO;

    socket.value.onAny((event, ...args) => {
      _onMessage({ topic: event, data: args[0] });
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

  const sub = (channel: string, callback: (topic: string, data: any) => void) => {
    const userId = useUserStore().userInfo.id;
    const userChannel = `${userId}/${channel}`;
    socket.value?.emit('subscribe', userChannel);

    if (!subscriptions.value.has(userChannel)) {
      subscriptions.value.set(userChannel, []);
    }
    subscriptions.value.get(userChannel)!.push(callback);
  };

  const unsub = (channel: string, callback?: (topic: string, data: any) => void) => {
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

  const psub = (channel: string, callback: (topic: string, data: any) => void) => {
    socket.value?.emit('subscribe', channel);
    const userChannel = `#/${channel}`;

    if (!subscriptions.value.has(userChannel)) {
      subscriptions.value.set(userChannel, []);
    }
    subscriptions.value.get(userChannel)!.push(callback);
  };

  const punsub = (channel: string, callback?: (topic: string, data: any) => void) => {
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

  const isConnected = () => {
    return !!socket.value?.connected;
  };

  return {
    open,
    close,
    sub,
    unsub,
    psub,
    punsub,
    isConnected
  };
});
