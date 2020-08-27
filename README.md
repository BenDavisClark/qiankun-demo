目录下  
qiankun-master 为主应用  
sub-app1 为子应用  
sub-app2 为子应用  

运行项目  
-- 切换到qiankun-master  
cd qiankun-master  
-- 安装依赖  
npm run install:all  
-- 启动项目  
npm run start  

#### 了解微前端
----
> Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently. -- Micro Frontends  
微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

微前端架构的核心价值：
- 技术栈无关 <br>
主框架不限制接入应用的技术栈，微应用具备完全自主权

- 独立开发、独立部署 <br>
微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

- 增量升级 <br>
在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略

- 独立运行 <br>
每个微应用之间状态隔离，运行时状态不共享  <br/>

[继续了解微前端](https://developer.aliyun.com/article/715922)

#### 了解qiankun
----
官方介绍：qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。
具体可看[官方文档](https://qiankun.umijs.org/zh)

## 搭建项目

### 一 创建目录结构 
----
本次demo基于vue-cli4创建项目  
前提条件: 已安装node和vue-cli
1. 创建一个新的文件夹 命名如 qiankun-demo  <br>  
2. 切换到qiankun-demo目录下创建一个主应用，运行 `vue create qiankun-master`  
[创建vue项目教程]( https://cli.vuejs.org/zh/guide/creating-a-project.html)  <br> 
3. 在qiankun-master同级目录创建若干子应用, 运行 `vue create sub-app1` `vue create sub-app2`

##### 现在的目录结构如图①所示 <br/>
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60b7b5cc840b43d6bdc6436e76eec216~tplv-k3u1fbpfcp-zoom-1.image)

安装依赖 前端工程化并行解决方案(同时跑多个命令)  
npm install concurrently -S 
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45e9d65b19964163a61088882176559a~tplv-k3u1fbpfcp-zoom-1.image)

### 二 编写项目
主应用 app.vue  
根据路由判断显示不同界面
```javascript
<template>
    <div id="root" class="mainApp">
        <template v-if="!isChildApp">
            <router-view/>
        </template>
        <template v-show="isChildApp" >
            <wu-layoutMain :loading="loading" :isChildApp="isChildApp" :content="content"></wu-layoutMain>
        </template>
    </div>
</template>
```

```
<script>
  computed: {
        isChildApp() {
          if(this.$route.path.match('sub-app')){
            return true;
          }else{
            return false;
          }
        }
      }
</script>
```
main.vue 框架布局菜单等
```javascript
 <!--内容区域-->
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <!--面包屑导航-->
                    <div class="bread-crumb-wrapper">
                        <Breadcrumb :style="{fontSize:'14px'}">
                            <BreadcrumbItem
                                    v-for="item in breadCrumbList"
                                    :to="item.to"
                                    :key="`bread-crumb-${item.name}`"
                            >
                                <common-icon style="margin-right: 4px;" :type="item.icon || ''"/>
                                {{showTitle(item)}}
                            </BreadcrumbItem>
                            <!--<BreadcrumbItem to="/">Home</BreadcrumbItem>-->
                            <!--<BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>-->
                            <!--<BreadcrumbItem>Breadcrumb</BreadcrumbItem>-->
                        </Breadcrumb>
                    </div>
                    <Content class="content-wrapper">
                        <!--<router-view/>-->
                        <template v-if="!isChildApp">
                        <!--//不是子应用就调用路由-->
                            <router-view/>
                        </template>
                        <template v-show="isChildApp">
                            <!--//子应用就加载 content-->
                            <div id="router-view" v-html="content"></div>
                        </template>
                    </Content>
                </Layout>
            </Content>
```
            
main.js   传递子应用数据 和 注册子应用等        
```javascript  
/**
 * 中央事件总线EventBus,用于通信。
 * 在Vue中可以使用 EventBus 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件
 */
Vue.prototype.$EventBus = new Vue()

import {registerMicroApps,runAfterFirstMounted, setDefaultMountApp, start} from 'qiankun';
import fetch from 'isomorphic-fetch';
let app = null;

let count1 = 0;
let count = 0;
function render({ appContent, loading }) {
  /*examples for vue*/
  if (!app) {
    app = new Vue({
      el: '#container',
      router,
      store,
      i18n,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else{
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });

// 支持自定义获取请参阅: https://github.com/kuitos/import-html-entry/blob/91d542e936a74408c6c8cd1c9eebc5a9f83a8dc0/src/index.js#L163
const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin',
  });


//注册子应用
registerMicroApps([
    {
      name: 'vue sub-app1',
      entry: '//localhost:7100/sub.html',
      render,
      activeRule: genActiveRule('/sub-app1')
    },
    {
      name: 'vue sub-app2',
      entry: '//localhost:7101',
      render,
      activeRule: genActiveRule('/sub-app2')
    },
    // { name: 'vue admin', entry: '//localhost:9428', render, activeRule: genActiveRule('/admin') },
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app);
      },
    ],
    beforeMount: [
      app => {
        console.log('before mount', app);
      },
    ],
    afterMount: [
      app => {
        console.log('after mount', app);
      },
    ],
    afterUnmount: [
      app => {
        console.log('after unload', app);
        app.render({appContent: '', loading: false});
      },
    ],
  },
  {
    fetch: request,
  },
);

/**
 * @description 设置哪个子应用程序在主加载后默认处于活动状态
 * @param defaultAppLink: string 跳转链接
 */
setDefaultMountApp('/home');

/**
 * @description 第一个应用构建完成后执行
 * @param 要执行的函数
 */
runAfterFirstMounted(() => console.info('first app mounted'));

/**
 * @description 启动主应用
 * @param prefetch 是否在第一次安装子应用程序后预取子应用程序的资产,默认为 true
 * @param jsSandbox 是否启用沙盒，当沙盒启用时，我们可以保证子应用程序是相互隔离的,默认为 true
 * @param singular 是否在一个运行时只显示一个子应用程序，这意味着子应用程序将等待挂载，直到卸载之前,默认为 true
 * @param fetch 设置一个fetch function,默认为 window.fetch
 */
start();
```
router相关
```
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import menus from './menus'
import childApps from './childApps'
let allMenus = routes.concat(menus)
import store from '@/store'
// import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
import routers from "@/router/routers";
const { homeName } = config


Vue.use(Router)
const router = new Router({
    routes:allMenus,
    mode: 'history',
    base: process.env.BASE_URL,
})
const LOGIN_PAGE_NAME = 'login'

//路由白名单之：子应用路径
const subApp_ROUTE = ['/sub-app1']

router.beforeEach((to, from, next) => {
  // iView.LoadingBar.start()
  const path = to.path;
  const token = getToken()
  // console.log(to,"=====路由对象")
  // if(subApp_ROUTE){
  //   next();
  // }
  if(token && to.name === undefined){
    //已登录，子页面以及未知页面
    next() // 跳转
  } else if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
  // 已登录 要跳转的 页面不是 登录页面
      if (store.state.user.hasGetInfo) {
        // 已经含有用户信息
        // vuex 中state的user 模块 hasGetInfo 为true
      // turnTo(to, store.state.user.access, next) //静态权限遗留,可不用
          next()
    } else {
      // 不含有 用户信息 ，请求获取用户相关信息
      //dispatch：与commit()作用相同 含有异步操作， 例如向后台提交数据，写法： this.$store.dispatch('mutations方法名',值)
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
       // turnTo(to, user.access, next)   //静态权限遗留,可不用
          next();
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  //根据当前跳转的路由设置显示在浏览器标签的title
  setTitle(to, router.app)
  // iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
```

### 三 常见问题及解决方案 
https://qiankun.umijs.org/zh/faq

### 四 代码地址
https://github.com/a758801405/qiankun-demo.git

### 五 预览
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d60652ca82f1415c9db0f852109d3e67~tplv-k3u1fbpfcp-zoom-1.image)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d22feef5973d4499a22caa4515e9fa47~tplv-k3u1fbpfcp-zoom-1.image)
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8a2df1297f2431a9993340394feaafd~tplv-k3u1fbpfcp-zoom-1.image)
