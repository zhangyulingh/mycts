<template>
  <div class="layout-navbars-breadcrumb-user-news">
    <div class="head-box">
      <div class="head-box-title">消息</div>
      <div class="head-box-btn" v-if="newsList.length > 0" @click="setReaded()">全部已读</div>
    </div>
    <div class="content-box" v-loading="showLoading">
      <template v-if="newsList.length > 0">
        <div class="content-box-item" v-for="(v, k) in newsList" :key="k">
          <div>{{ v.title }}</div>
          <div class="content-box-msg">
            {{ v.contents }}
          </div>
          <div class="content-box-time">{{ v.publish_date }}</div>
        </div>
      </template>
      <el-empty description="暂无通知" v-else></el-empty>
    </div>
    <!--    <div class="foot-box" @click="onGoToGiteeClick" v-if="state.newsList.length > 0">前往通知中心</div>-->
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
import {onMounted, reactive, Ref, ref} from "vue"
import {request} from "@/utils/request"
import {OrderInfo} from "@/types/OrderInfo"
import ApiConfig from "@/api/ApiConfig"
import {MessageInfo} from "@/types/MessageInfo"
import bus from "@/utils/mitt"

// 定义变量内容
const newsList = ref<MessageInfo[]>([])
const showLoading = ref(false)

onMounted(() => getList())

const getList = () => {
  showLoading.value = true
  request<ListData<OrderInfo>>({
    url: `${ApiConfig.ANNOUNCEMENT_LIST}/1/999`,
    method: "GET",
    params: {read_flag: 0},
  })
    .then((value) => {
      newsList.value = value.data
    })
    .finally(() => {
      showLoading.value = false
    })
}

/**
 * 标为已读
 * @param info
 */
const setReaded = () => {
  request({
    url: `${ApiConfig.ANNOUNCEMENT_READ_ALL}`,
    method: "PUT",
  })
    .then(() => {
      getList()
      bus.emit("RefreshNews")
    })
    .finally(() => {
      showLoading.value = false
    })
}
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
  .head-box {
    display: flex;
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
    color: var(--el-text-color-primary);
    justify-content: space-between;
    height: 35px;
    align-items: center;

    .head-box-btn {
      color: var(--el-color-primary);
      font-size: 13px;
      cursor: pointer;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }

  .content-box {
    font-size: 13px;

    .content-box-item {
      padding-top: 12px;

      &:last-of-type {
        padding-bottom: 12px;
      }

      .content-box-msg {
        color: var(--el-text-color-secondary);
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .content-box-time {
        color: var(--el-text-color-secondary);
      }
    }
  }

  .foot-box {
    height: 35px;
    color: var(--el-color-primary);
    font-size: 13px;
    cursor: pointer;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);

    &:hover {
      opacity: 1;
    }
  }

  :deep(.el-empty__description p) {
    font-size: 13px;
  }
}
</style>