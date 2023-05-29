<template>
  <div class="common-layout">
    <el-container class="box">
      <el-aside width="200px">
        <div class="left">
          <h3>学生管理平台</h3>
          <common-aside/>
        </div>
      </el-aside>
      <el-container>
        <el-header height="1">
            <div class="head">
              <common-head/>
            </div>
        </el-header>
        <el-main>
            <div class="bodymain">
                <router-view/>
            </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang='ts'>
  import commonAside from '@/components/commonAside.vue'
  import commonHead from '@/components/commonHead.vue'
</script>
<style lang='scss' scoped>
.el-main,.el-header{
    padding: 0;
}
.common-layout{
    height: 100%;
    min-width: 1300px;
    .box{
        height: 100%;
    }
    .left{
        height: 100%;
        background-color: #555c67;
        h3{
            color: #fff;
            font-size: 20px;
            text-align: center;
            margin: 0;
            padding: 10px 0;
        }
    }
    .head{
        height: 60px;
        display: flex;
        align-items: flex-end;
        background-color: #343334;
      
    }
    .bodymain{
        height: 96%;
        min-height: 600px;
        padding: 10px;
    }
}
    
  
</style>