<template>
    <div class="row">
        <div class="col-md-8">
            <sub-articles-page></sub-articles-page>
        </div>
        <div class="col-md-1"></div>
        <sub-nav-page class="col-md-3"></sub-nav-page>
    </div>
</template>
<script>
    import SubNavPage from './SubNavPage.vue'
    import SubArticlesPage from './SubArticlesPage.vue'
    export default {
        components: {
            SubArticlesPage,
            'sub-nav-page': SubNavPage,
            'sub-articles-page': SubArticlesPage
        }
    }
</script>