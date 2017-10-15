<template>
  <div>
    <navigation-bar></navigation-bar>
    <page-list></page-list>
  </div>
</template>

<script>
  import NavigationBar from './components/NavigationBar.vue'
  import PageList from './components/PageList.vue'
export default {
  name: 'app',
    components: {
      'navigation-bar': NavigationBar,
        'page-list': PageList
    }
}
</script>
