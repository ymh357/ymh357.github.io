<template>
    <div>
        <img src="/static/Categories_65px_524338_easyicon.net.png">
        <h3>文章分类<small>Categories</small></h3>
        <ul class="list-unstyled">
            <li class="categoryItem"><a href="#/page1?category=前端综合">前端综合</a> ({{frontNum}})</li>
            <li class="categoryItem"><a href="#/page1?category=后端综合">后端综合</a> ({{backNum}})</li>
            <li class="categoryItem"><a href="#/page1?category=动漫综合">动漫综合</a> ({{animeNum}})</li>
            <li class="categoryItem"><a href="#/page1?category=随笔综合">随笔综合</a> ({{essayNum}})</li>
        </ul>
    </div>
</template>

<script>
    import {articles} from '../pseudo-Database/articles.js'
    export default {
        date (){
            return {
                articles: articles
            }
        },
        computed: {
            frontNum() {
                let num=0;
                for(let i=0;i<articles.length;i++){
                    if(articles[i].category=='前端综合'){
                        num ++;
                    }
                }
                return num;
            },
            backNum() {
                let num=0;
                for(let i=0;i<articles.length;i++){
                    if(articles[i].category=='后端综合'){
                        num ++;
                    }
                }
                return num;
            },
            animeNum() {
                let num=0;
                for(let i=0;i<articles.length;i++){
                    if(articles[i].category=='动漫综合'){
                        num ++;
                    }
                }
                return num;
            },
            essayNum() {
                let num=0;
                for(let i=0;i<articles.length;i++){
                    if(articles[i].category=='随笔综合'){
                        num ++;
                    }
                }
                return num;
            }
        }
    }
</script>

<style scoped>
    div{
        padding: 10px;
        margin-top:40px;
        background: url("/static/images.jpg");
    }
    li.categoryItem{
        display:inline-block;
        width:49%;
    }
    li.categoryItem>a{
        color: #8a6d3b;
    }
    img{
        float:left;
        height:25px;
        width:25px;
    }
    h3{
        display: inline;
    }
    ul{
        width:100%;
        margin-top:10px;
    }
</style>