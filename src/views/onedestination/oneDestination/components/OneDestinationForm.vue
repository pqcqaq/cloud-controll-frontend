<template>
  <el-dialog
    v-model="visible"
    :title="`${paramsProps.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="paramsProps.row"
      @submit.enter.prevent="handleSubmit"
    >
      <el-form-item
        label="实际地址"
        prop="address"
      >
        <el-input
          v-model="paramsProps.row.address"
          placeholder="请填写实际地址"
          :rows="2"
          type="textarea"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="enable"
      >
        <!-- <el-input-number
          v-model="paramsProps.row.enable" :precision="0" :min="1" :max="999999" /> -->
        <el-switch v-model="paramsProps.row.enable" />
      </el-form-item>
      <el-form-item
        label="显示名称"
        prop="label"
      >
        <el-input
          v-model="paramsProps.row.label"
          placeholder="请填写显示名称"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type ElForm, ElMessage } from 'element-plus'

defineOptions({
    name: 'OneDestinationForm'
})

const rules = reactive({
  delFlag: [{ required: true, message: '请填写删除与否' }],
  address: [{ required: true, message: '请填写实际地址' }],
  enable: [{ required: true, message: '请填写是否启用' }],
  label: [{ required: true, message: '请填写显示名称' }],
})

const visible = ref(false)
const paramsProps = ref<View.DefaultParams>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined
})

// 接收父组件传过来的参数
const acceptParams = (params: View.DefaultParams) => {
  paramsProps.value = params
  visible.value = true
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await paramsProps.value.api!(paramsProps.value.row)
      ElMessage.success({ message: `${paramsProps.value.title}成功！` })
      paramsProps.value.getTableList!()
      visible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>

<style scoped lang="scss"></style>