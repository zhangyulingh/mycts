<script setup lang="ts" name="layoutBreadcrumbUser">
import {defineAsyncComponent, ref, unref, computed} from "vue"
import {useRouter} from "vue-router"
import {ElMessageBox, ClickOutside as vClickOutside} from "element-plus"
import {storeToRefs} from "pinia"
import {useUserInfo} from "@/stores/userInfo"
import {useThemeConfig} from "@/stores/themeConfig"
import {Session, Local} from "@/utils/storage"

// 引入组件
const UserNews = defineAsyncComponent(() => import("@/layout/navBars/topBar/userNews.vue"))
const Search = defineAsyncComponent(() => import("@/layout/navBars/topBar/search.vue"))

// 定义变量内容
const userNewsRef = ref()
const userNewsBadgeRef = ref()
const router = useRouter()
const stores = useUserInfo()
const storesThemeConfig = useThemeConfig()
const {userInfos} = storeToRefs(stores)
const {themeConfig} = storeToRefs(storesThemeConfig)
const searchRef = ref()
// 设置分割样式
const layoutUserFlexNum = computed(() => {
  let num: string | number = ""
  const {layout, isClassicSplitMenu} = themeConfig.value
  const layoutArr: string[] = ["defaults", "columns"]
  if (layoutArr.includes(layout) || (layout === "classic" && !isClassicSplitMenu)) num = "1"
  else num = ""
  return num
})

// 消息通知点击时
// const onUserNewsClick = () => {
//   unref(userNewsRef).popperRef?.delayHide?.()
// }

// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
  if (path === "logOut") {
    ElMessageBox({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      title: "提示",
      message: "此操作将退出登录, 是否继续?",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      buttonSize: "default",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = "退出中"
          setTimeout(() => {
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          }, 700)
        } else {
          done()
        }
      },
    })
      .then(async () => {
        // 清除缓存/token等
        Session.clear()
        Local.clear() //重置主题
        // 使用 reload 时，不需要调用 resetRoute() 重置路由
        window.location.reload()
      })
      .catch(() => {})
  } else if (path === "wareHouse") {
    window.open("https://gitee.com/lyt-top/vue-next-admin")
  } else {
    router.push(path)
  }
}
</script>
<template>
  <div class="layout-navbars-breadcrumb-user pr-15px" :style="{flex: layoutUserFlexNum}">
    <!-- <div class="layout-navbars-breadcrumb-user-icon mr-5px">
      <el-popover placement="bottom" trigger="click" popper-class="my-popover" width="300px">
        <template #reference>
          <el-icon color="white" :size="19">
            <ele-Service />
          </el-icon>
        </template>
        <div class="w-full flex flex-col overflow-hidden items-center pb-20px">
          <span class="py-15px px-26px text-primary text-18px font-bold w-full bg-gradient-to-r from-#E6F0FF to-#F5F9FE">在线客服</span>
          <div class="px-26px flex flex-col w-full">
            <span class="py-15px text-18px font-black w-full text-black">客服热线：13382856693</span>
            <span class="h-1px bg-gradient-to-r from-[#E6F0FF] to-[#F5F9FE]"></span>
            <div class="flex flex-row justify-between pt-20px">
              <div class="flex flex-col">
                <div class="text-18px font-black mt-50px text-black">客服微信：</div>
                <div class="items-center flex flex-row">
                  <span class="text-13px text-gray-700">扫码咨询</span>
                  <img src="@/assets/img/icon_arrow3.png" class="ml-[-10px]" />
                </div>
              </div>
              <img src="@/assets/img/img_code.png" />
            </div>
          </div>
        </div>
      </el-popover>
    </div> -->
    <!-- <div class="layout-navbars-breadcrumb-user-icon mr-20px" ref="userNewsBadgeRef">
      <el-icon color="white" :size="19">
        <ele-Bell />
      </el-icon>
    </div> -->
    <el-popover
      ref="userNewsRef"
      :virtual-ref="userNewsBadgeRef"
      placement="bottom"
      trigger="click"
      transition="el-zoom-in-top"
      virtual-triggering
      :width="300"
      :persistent="false">
      <UserNews />
    </el-popover>

    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
      <span class="layout-navbars-breadcrumb-user-link color-white space-x-15px">
        <img src="@/assets/img/icon_user.png" class="layout-navbars-breadcrumb-user-link-photo" />
        <span class="layout-navbars-breadcrumb-user-link-name">{{ userInfos.userName }}</span>
        <span> {{ userInfos.full_name === "" ? "common" : userInfos.full_name }}</span>
        <el-icon class="el-icon--right">
          <ele-CaretBottom />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logOut"><i class="iconfont icon-tuichu"></i>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Search ref="searchRef" />
  </div>
</template>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }

  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--next-bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:hover {
      background: var(--next-color-user-hover);

      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }

  :deep(.el-dropdown) {
    color: var(--next-bg-topBarColor);
  }

  :deep(.el-badge) {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }

  :deep(.el-badge__content.is-fixed) {
    top: 12px;
  }
}
</style>
<style>
.el-popover.my-popover {
  padding: 0 0;
  min-width: calc(320 * var(--zoom) * 1px);
}
</style>
