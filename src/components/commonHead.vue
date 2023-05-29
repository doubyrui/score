<template>
    <el-tabs
      :model-value="editableTabsValue"
      type="card"
      class="demo-tabs"
      :closable="closable"
      @tab-remove="removeTab"
      @tab-change="handleTabChange($event)"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.path"
        :label="item.name"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>
  </template>
  <script lang="ts" setup>
  import { onMounted,ref,computed } from 'vue';
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { useMapState } from '../Hooks/useMapState'
  import { useStore  } from 'vuex';
  const stores = useStore() //vuex
  const route = useRoute() //路由信息
  const router = useRouter() //路由跳转
  import store from '@/store';
  const { crumbs } = useMapState(['crumbs'])

  onMounted(()=>{
    editableTabs.value = crumbs.value.crumbsList
    stores.commit('routerP',editableTabs.value)
  })
  const editableTabs = ref([]) as any
  const removeTab = (targetName: string) => {
    if (editableTabs.value.length === 1) {
      ElMessage({
        message: 'Warning, this is a warning message.',
        type: 'warning',
      })
      return
    }
    editableTabs.value = editableTabs.value.filter((tab:any) => tab.path !== targetName)
    stores.commit('deleteTab',editableTabs.value)
    let topath = crumbs.value.crumbsList[crumbs.value.crumbsList.length-1].path
    let routerObj = crumbs.value.crumbsList.find((res:any)=>res.path == topath)
    store.commit('routerP',routerObj)
    router.push(editableTabsValue.value)
  }
  const handleTabChange = (tab: any) => {
    router.push(tab)
  }
  const editableTabsValue = computed(()=>{
    return crumbs.value.routerPath.path
  })
  const closable = computed(()=>{
    return crumbs.value.crumbsList.length === 1 ? false : true
  })
  </script>
  <style lang='scss' scoped>
  .demo-tabs {
    ::v-deep(){
        .el-tabs__content {
          display: none !important;
        }
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__item{
            background-color: #fff;
        }
      }
  } 
  </style>
  