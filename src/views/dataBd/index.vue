<script setup lang="ts">
import Header from "./components/Header.vue"
</script>

<template>
  <div class="view-container">
    <Header class="animate-slide-in-down" />
  </div>
</template>

<style lang="scss">
.view-container {
  height: 100%;
  width: 100%;
  background-color: #081326;
  --header-h: 105px;
  .view-header {
    height: var(--header-h);
  }
  .view-footer {
    height: 120px;
  }
  .view-content {
    margin-top: -20px;
    height: calc(100% - var(--header-h) + 20px);
    padding: 20px;
  }
}
</style>
