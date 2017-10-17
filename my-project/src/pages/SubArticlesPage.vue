<template>
    <div id="wrapper">
        <!--<div id="diagonal"></div>-->
        <template v-if="$route.path === '/' || $route.path.indexOf('/page1')!=-1">
            <article-div v-for="article in currentShownArticles" :article="article"></article-div>
            <div id="paging">
                <span :style="{height:preHeight+'px'}"><a v-show="currentPage>1" href="" @click="toPrevious($event)" @mouseenter="preHeight+=10" @mouseleave="preHeight-=10" ><img src="/static/previous.png"></a></span>
                <span>{{currentPage}}/3</span>
                <span :style="{height:nextHeight+'px'}"><a v-show="currentPage<currentArticles.length/4" href="" @click="toNext($event)" @mouseenter="nextHeight+=10" @mouseleave="nextHeight-=10"><img src="/static/next.png"></a></span>
            </div>
        </template>
        <router-view></router-view>
    </div>

</template>

<script>

    import ArticleDiv from '../components/ArticleDiv.vue'
    import {articles} from '../pseudo-Database/articles.js'
    export default {
        components: {
            'article-div': ArticleDiv
        },
        data (){
            return {
                currentPage: 1,
                preHeight: 24,
                nextHeight: 24,
            }
        },
        computed: {
            currentShownArticles (){
                return this.currentArticles.slice((this.currentPage-1)*4,(this.currentPage-1)*4+4)
            },
            currentArticles (){
                let indexes=[];
                let currentArticles=[];
                let anchor=this.$route.query.category
                if(!anchor){
                    for(let i=0;i<articles.length;i++){
                        indexes.push(i)
                    }
                }else{
                    for(let i=0;i<articles.length;i++){
                        if(articles[i].category===anchor){
                            indexes.push(i)
                        }
                    }
                }
                for(let index of indexes){
                    currentArticles.push(articles[index])
                }
                return currentArticles
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
        float: left;
        display:inline-block;
        width:80px;
    }
    img{
        height:100%;
    }
    div#paging{
        text-align: center;
        height:80px;
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