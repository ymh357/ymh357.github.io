<template>
  <div class="appWrapper ">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8 col-md-offset-2 col-xs-12">
          <navigation-bar></navigation-bar>
          <top-img></top-img>
          <router-view></router-view>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import NavigationBar from './components/NavigationBar.vue'
  import TopImg from './components/TopImg.vue'
  import MyFooter from './components/MyFooter.vue'
export default {
  name: 'app',
    components: {
      'navigation-bar': NavigationBar,
        'top-img': TopImg,
        'my-footer': MyFooter
    }
}
</script>

<style scoped>
  div.appWrapper{
    background-image: url("../static/xz.jpg");
  }
</style>