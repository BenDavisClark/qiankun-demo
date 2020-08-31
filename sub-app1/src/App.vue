<template>
  <div id="app">
    <div id="nav">
        <router-link to="/sub-app1">子应用1:home页面</router-link> |
        <router-link to="/sub-app1/about">子应用1:about页面</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .home,.about{
    text-align: center;
  }
}
#nav {
  padding: 50px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
