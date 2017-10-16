<template>
    <div>
        <article-div></article-div>
        <article-div :article="article2"></article-div>
    </div>

</template>

<script>
    import ArticleDiv from '../components/ArticleDiv.vue'
    export default {
        components: {
            'article-div': ArticleDiv
        },
        data (){
            return {
                article2: {
                    title: '小而合理的前端理论：rscss和rsjs',
                    date: '2017-01-16',
                    category: '前端综合',
                    summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                    link: ''
                }
            }
        }
    }
</script>