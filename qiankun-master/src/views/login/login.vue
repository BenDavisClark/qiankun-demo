<template>
    <div class="loginBack">
        <div class="box-card">
            <el-input style="margin-bottom: 16px" clearable v-model="userName" placeholder="请输入用户名"></el-input>
            <el-input style="margin-bottom: 16px" type="password" clearable  v-model="password" placeholder="请输入密码"></el-input>
            <div class="btn login" @click="login">登录</div>
        </div>
    </div>
</template>

<script>

    import { mapActions } from 'vuex'
    import {setToken} from '@/libs/util'
    export default {
        name:'login',
        data(){
            return {
                userName:'',
                password:''
            }
        },
        methods:{
            ...mapActions([
                'handleLogin',
                'getUserInfo'
            ]),
            login(){
                if(!this.userName) {
                    this.$Message.error('请输入用户名！')
                    return
                }
                if(!this.password) {
                    this.$Message.error('请输入密码！')
                    return
                }
                this.handleLogin({
                    userName:this.userName,
                    password:this.password
                }).then((res)=>{
                    this.getUserInfo().then((res)=>{
                        this.$router.push({
                            name: this.$config.homeName
                        })
                    })

                })
            }
        }
    }

</script>

<style lang="scss" scoped>
  .loginBack{
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/login_bg2.jpg");
    background-size: contain;//此时会保持图像的纵横比并将图像缩放成将适合背景定位区域的 最大 大小。
    background-position: center;
    position: relative;
    .box-card{
      position: absolute;
      width: 400px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 5px;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      margin: 0 auto;
      padding: 20px;
      background-color: rgba(255,255,255,0);
    }
  }
  .btn{
    display: inline-block;
    line-height: 40px;
    height: 40px;
    font-size: 12px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    background-color: #0485E8;
    width: 100%;
    text-align: center;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    &:hover{
      background-color: #037edd;
    }
  }
</style>
