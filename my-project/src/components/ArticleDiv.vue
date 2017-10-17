<template>
    <div>
        <img src="/static/article.jpg">
        <h3>{{article.title}}</h3>
        <ul class="list-unstyled">
            <li><small>日期：{{article.date}}</small></li>
            <li><small>分类：{{article.category}}</small></li>
        </ul>
        <p>{{article.summary}}</p>
        <a :href="article.link">阅读全文 »</a>
    </div>
</template>

<script>
    export default {
        props: {
            article: {
                type: Object,
                default (){
                    return {
                        title: 'Webpack中hash的用法',
                        date: '2017-07-19',
                        category: '工作流',
                        summary: 'Webpack的构建除了常规的输出之外，还可以选择带hash的输出。这种输出文件很有用，但处理起来并不是很容易。本文将针对这个问题，展示一些可行的方案。',
                        link: ''
                    }
                }
            }
        }
    }
</script>

<style scoped>
    img{
        float:left;
        height:25px;
        width:25px;
    }
    h3{
        display: inline;
    }
    ul{
        margin: 20px 0;
    }
    li{
        display:inline-block;
        margin-left: 50px;
    }
    div{
        margin: 0;
        border-bottom: 1px dashed #8c8c8c;
    }
</style>