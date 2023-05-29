<template>
  <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        :collapse="data.isCollapse"
        class="el-menu-vertical-demo"
        :default-active="data.defaultID"
        text-color="#fff"
      >
        <el-menu-item :index="item.id" v-for="(item,i) in data.routeList" :key="item.id" @click="handMenu(item)">
          <component :is="item.icon" style="width: 20px; height:20px;"/>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
</template>
<script setup lang='ts'>
  import { reactive,onMounted,watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import { useMapState } from '../Hooks/useMapState'
  import { useStore  } from 'vuex';
  const store = useStore() //vuex
  const { crumbs } = useMapState(['crumbs'])
  const route = useRoute() //路由信息
  const router = useRouter() //路由跳转
  const data = reactive({
    isCollapse:false,
    defaultID:'1' as any,
    routeList:[ //路由列表
      {
        name:'学生管理',
        path:'/student',
        icon:'setting',
        id:'1',
      },
      {
        name:'答题情况',
        path:'/answer',
        icon:'Menu',
        id:'2',
      },
      {
        name:'成绩统计',
        path:'/performance',
        icon:'Histogram',
        id:'3',
      }
    ]
  })
  onMounted(()=>{
    defaultSelect()
  })
  
  const handMenu = (e: any) => {
      store.commit('addTab',e)
      store.commit('routerP',e)
      router.push(e.path)
      data.defaultID=crumbs.value.routerPath.id
  }
  const defaultSelect= () => {
      data.defaultID = data.routeList.find(res=>res.path == route.fullPath)?.id
      let obj = data.routeList.find(res=>res.id == data.defaultID)
      store.commit('addTab',obj)
      store.commit('routerP',obj)
  }

  watch(() => route,
    (newVal:any, oldVal:any) => {
      let obj = data.routeList.find(res=>res.path == route.path)
      handMenu(obj)
    },
    {
      immediate: true, // 立即执行
      deep: true // 深度监听
    }
  ) as any
</script>
<style lang='scss' scoped>
  .el-menu{
    border: none;
  }
</style>