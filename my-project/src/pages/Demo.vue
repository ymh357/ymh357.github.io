<template>
    <div class="row">
        <div class="col-md-8"></div>
        <div class="col-md-1"></div>
        <sub-nav-page class="col-md-3"></sub-nav-page>
    </div>
</template>
<script>
    import SubNavPage from './SubNavPage.vue'
    export default {
        components: {
            'sub-nav-page': SubNavPage
        }
    }
</script>