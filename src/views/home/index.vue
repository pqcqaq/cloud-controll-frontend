<template>
  <div class="log-list">
    <el-table
      :data="logData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="createTime"
        label="Time"
        width="180"
      />
      <el-table-column
        prop="level"
        label="Level"
        width="100"
      >
        <template #default="scope">
          <el-tag
            :type="getLevelTagType(scope.row.level)"
            size="small"
          >
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="msg"
        label="Message"
      />
      <el-table-column
        prop="metadata"
        label="Metadata"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useSysLogStore } from '@/stores/modules/syslog';

// const logData = ref<any[]>([]);
const { logData } = storeToRefs(useSysLogStore());

const getLevelTagType = (level: string) => {
  switch (level) {
    case 'INFO':
      return 'success'; // Green for INFO
    case 'WARN':
      return 'warning'; // Orange for WARN
    case 'ERROR':
      return 'danger'; // Red for ERROR
    case 'DEBUG':
      return 'info'; // Blue for DEBUG
    default:
      return undefined;
  }
};
</script>

<style scoped lang="scss">
.log-list {
  padding: 20px;

  .el-table {
    border-radius: 8px; // Rounded table corners
    overflow: hidden; // Prevents tag overflow

    .el-table__row {
      cursor: pointer; // Make rows clickable (optional)

      &:hover {
        background-color: #f5f7fa; // Subtle hover effect
      }
    }

    .el-tag {
      font-weight: bold; // More prominent log level
    }

    .el-table__header {
      background-color: #f5f7fa; // Light header background
    }

    .el-table__cell {
      padding: 12px 0; // Adjust cell padding for better spacing
    }
  }
}
</style>
