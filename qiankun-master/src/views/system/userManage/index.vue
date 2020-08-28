<template>
    <div class="userManage">
        <h2>用户管理页面</h2>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'

    export default {
      name: "index",
      data(){
        return{
          content:''
        }
      },
      methods:{
        ...mapMutations([
          "setMicroAppHtml"
        ]),
      },
      watch:{
        content(value,oldValue){
          debugger
          this.setMicroAppHtml(value)
        },
      }
    }
</script>

<style scoped>

</style>