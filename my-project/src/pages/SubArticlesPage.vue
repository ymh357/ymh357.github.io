<template>
    <div id="wrapper">
        <!--<div id="diagonal"></div>-->
        <article-div v-for="article in currentShownArticles" :article="article"></article-div>
        <div id="paging">
            <span><a v-show="currentPage>1" href="" @click="toPrevious($event)"><img src="/static/previous.png"></a></span>
            {{currentPage}}/3
            <span><a v-show="currentPage<articles.length/4" href="" @click="toNext($event)"><img src="/static/next.png"></a></span>
        </div>
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
                currentPage: 1,
                articles: [
                    {
                        title: '小而合理的前端理论：rscss和rsjs1',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs2',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs3',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs4',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs5',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs6',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs7',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs8',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs9',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs10',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                    {
                        title: '小而合理的前端理论：rscss和rsjs11',
                        date: '2017-01-16',
                        category: '前端综合',
                        summary: '前端开发有一些简单、易于遵循的规则和约定吗？这里有rscss和rsjs推荐给你',
                        link: ''
                    },
                ]
            }
        },
        computed: {
            currentShownArticles (){
                return this.articles.slice((this.currentPage-1)*4,(this.currentPage-1)*4+4)

            }
        },
        methods: {
            toNext(event){
                this.currentPage++
                event.preventDefault()
            },
            toPrevious(event){
                this.currentPage--
                event.preventDefault()
            }
        }
    }
</script>

<style scoped>
    span{
        display:inline-block;
        width:80px;
    }
    a>img{
        height:25px;
    }
    div#paging{
        text-align: center;
    }
    /*div#wrapper{
        position: relative;
    }
    div#diagonal{
        position:absolute;
        !*clip-path: polygon(5% 5%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);*!
        width:145px;
        height:84px;
        background: url("/static/diagonal.png") no-repeat;
        background-size:145px 84px;
        z-index: 1;
        top:-70px;
        right:-70px;
    }*/
    div{
        background-color:white;
        margin-top:40px;
        padding: 20px;
    }
</style>