<template>
    <div class="row">
        <div class="col-md-8">
            <sub-demo-page></sub-demo-page>
        </div>
        <sub-nav-page class="col-md-3 col-md-offset-1"></sub-nav-page>
    </div>
</template>
<script>
    import SubNavPage from './SubNavPage.vue'
    import SubDemoPage from './SubDemoPage.vue'
    export default {
        components: {
            SubDemoPage,
            'sub-nav-page': SubNavPage,
            'sub-demo-page': SubDemoPage
        }
    }
</script>