<template>
  <el-upload
    :drag="drag"
    :multiple="limit > 1"
    :limit="limit"
    list-type="text"
    :accept="accept"
    :class="['upload', drag ? 'no-border' : '']"
    v-model:file-list="_fileList"
    :http-request="uploadFileRequest"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
  >
    <div class="note-box">
      <el-icon class="upload_icon">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        <template v-if="drag"> 拖拽或<em>点击上传</em> </template>
        <template v-else> 点击上传 </template>
      </div>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        <slot name="tip" />
      </div>
    </template>
    <template #file="{ file }">
      <ul class="el-upload-list el-upload-list--text">
        <li class="el-upload-list__item is-success" tabindex="0">
          <div class="el-upload-list__item-info">
            <a class="el-upload-list__item-name">
              <el-icon class="el-icon el-icon--document">
                <Document />
              </el-icon>
              <span class="el-upload-list__item-file-name" :title="file.name" :style="{ width: `calc(${width} - 80px)` }">
                {{ file.name }}
              </span>
            </a>
          </div>
          <el-progress
            v-if="file.status === 'uploading'"
            type="line"
            :stroke-width="2"
            :percentage="file.percentage"
            style="margin-top: 0.5rem"
          />
          <el-icon v-if="file.status === 'success'" class="el-icon el-icon--remove" @click="handleRemove(file)">
            <Close />
          </el-icon>
          <el-icon v-if="file.status === 'success'" class="el-icon el-icon--download" @click="handlerDownloadFile(file)">
            <Download />
          </el-icon>
        </li>
      </ul>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { Download, UploadFilled } from '@element-plus/icons-vue';
import { ref, watch } from 'vue';
import { uploadFile, uploadTmpFile } from '@/api/modules/system/upload';
import { ElNotification, type UploadFile, type UploadProps, type UploadRequestOptions, type UploadUserFile } from 'element-plus';
import type { IUploadResult } from '@/api/interface/system/upload';
import type { AxiosProgressEvent } from 'axios';

defineOptions({
  name: 'UploadFiles'
});

type Props = {
  fileList?: UploadUserFile[];
  type?: string;
  tip?: string;
  multiple?: boolean;
  drag?: boolean;
  limit?: number; // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
  accept?: string;
  modelValue?: number | number[];
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
};

const props = withDefaults(defineProps<Props>(), {
  fileList: () => [],
  type: 'firmware',
  tip: '',
  multiple: false,
  drag: true,
  limit: 1,
  fileSize: 5,
  // 必须是.bin文件
  accept: '.bin',
  height: '150px',
  width: '200px'
});

const emit = defineEmits<{
  'update:modelValue': [number | (number | undefined)[]];
  'update:fileList': [value: UploadUserFile[]];
  change: [value: IUploadResult];
}>();
const _fileList = ref<UploadUserFile[]>([]);

// 监听 props.fileList 列表默认值改变
watch(
  props.fileList,
  (newFileList: UploadUserFile[]) => {
    _fileList.value = [...newFileList]; // 深拷贝防止引用问题
  },
  { immediate: true } // 初始化时执行
);

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
  const fileSize = rawFile.size / 1024 / 1024 < props.fileSize;
  /*  const imgType = props.fileType.includes(rawFile.type as File.ImageMimeType);
      if (!imgType)
        ElNotification({
          title: '温馨提示',
          message: '上传图片不符合所需的格式！',
          type: 'warning'
        });*/
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: `上传文件大小不能超过 ${props.fileSize}M！`,
        type: 'warning'
      });
    }, 0);
  return /*imgType &&*/ fileSize;
};

/**
 * @description 文件数超出
 * */
const handleExceed = () => {
  ElNotification({
    title: '温馨提示',
    message: `当前最多只能上传 ${props.limit} 份文件，请移除后上传！`,
    type: 'warning'
  });
};

// 重新设置的上传
const uploadFileRequest = async (options: UploadRequestOptions) => {
  try {
    const { data } = await uploadFile(
      {
        file: options.file,
        dirTag: props.type
      },
      {
        onUploadProgress(event: AxiosProgressEvent) {
          const progressEvent = new ProgressEvent('upload', {
            lengthComputable: event.total !== undefined,
            loaded: event.loaded || 0,
            total: event.total || 0
          });
          options.onProgress(new CustomUploadProgressEvent(progressEvent));
        }
      }
    );
    options.onSuccess(data);
  } catch (error) {
    options.onError(error as any);
  }
};

const successedList = ref<
  (IUploadResult & {
    uid: number;
  })[]
>([]);

const handleSuccess = (response: IUploadResult | undefined, file: UploadFile) => {
  if (!response) return;
  successedList.value.push({
    ...response,
    uid: file.uid
  });
  file.url = response.url;
  file.name = response.filename;
  emit('update:fileList', _fileList.value);
  emit('change', response);
  // 成功的时候emit到父组件
  const idList = props.limit > 1 ? successedList.value.map(item => item.fileId) : response.fileId;
  emit('update:modelValue', idList);
};

const handleRemove = (file: UploadFile) => {
  _fileList.value = _fileList.value.filter(item => item.url !== file.url || item.name !== file.name);
  // 删除成功的文件
  successedList.value = successedList.value.filter(item => item.uid !== file.uid);
  emit('update:fileList', _fileList.value);
  emit('change', null);
};

const handlerDownloadFile = (file: UploadFile) => {
  const link = document.createElement('a'); // 创建一个 a 标签用来模拟点击事件
  link.style.display = 'none';
  link.href = file.url + '';
  const fileName = file.name;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

class CustomUploadProgressEvent extends ProgressEvent {
  percent: number;
  constructor(event: ProgressEvent) {
    super(event.type, event);
    this.percent = event.lengthComputable ? Math.round((event.loaded / event.total) * 100) : 0;
  }
}
</script>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(width);
  height: v-bind(height);
  padding: 0;
  overflow: hidden;
  background-color: transparent;
  border: 1px dashed var(--el-border-color-darker);

  &:hover {
    border: 1px dashed var(--el-color-primary);
  }
}

.note-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .upload_icon {
    font-size: 32px;
    margin-bottom: 1px;
  }
}

.upload-info-box {
  width: 100%;

  .upload-type {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-size: 24px;
  }
}

.el-upload__tip {
  line-height: 15px;
  text-align: center;
}

.upload-box {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.upload-file-list .upload-file-item {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-file-list .file-name,
.upload-file-list .file-size {
  margin-right: 10px;
}

.el-upload-list__item-file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 14px;
}

:deep(.el-upload-list__item) {
  transition: none;
}

.el-upload-list__item .el-icon--remove {
  font-size: medium;
  color: var(--el-text-color-regular);
  cursor: pointer;
  opacity: 0.75;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity var(--el-transition-duration);
}

.el-upload-list__item .el-icon--remove:hover {
  font-weight: bold;
  color: crimson;
}

.el-upload-list__item .el-icon--download {
  font-size: medium;
  color: var(--el-text-color-regular);
  cursor: pointer;
  opacity: 0.75;
  position: absolute;
  right: 15px;
  top: 50%;
  padding-right: 10px;
  transform: translateY(-50%);
  transition: opacity var(--el-transition-duration);
}

.el-upload-list__item .el-icon--download:hover {
  font-weight: bold;
  color: deepskyblue;
}

.el-upload-list .el-upload-list--text {
  line-height: 24px;
  font-size: 28px;
}

:deep(.el-progress__text) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
