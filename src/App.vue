<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <router-link to="/products"><a-menu-item key="1">Produk</a-menu-item></router-link>
        <router-link to="/customers"><a-menu-item key="2">Customer</a-menu-item></router-link>
        <router-link to="/transactions"><a-menu-item key="3">Transaksi</a-menu-item></router-link>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <router-view/>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script setup>
import { ref } from "vue";
const selectedKeys = ref(["1"]);
</script>
<style>

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}


</style>