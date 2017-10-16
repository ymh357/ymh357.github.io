<template>
    <div>
        <img src="/static/Categories_65px_524338_easyicon.net.png">
        <h3>文章分类<small>Categories</small></h3>
        <ul class="list-unstyled">
            <li class="categoryItem">CSS3 (0)</li>
            <li class="categoryItem">HTML5 (0)</li>
            <li class="categoryItem">JS (0)</li>
            <li class="categoryItem">sth1 (0)</li>
            <li class="categoryItem">sth2 (0)</li>
            <li class="categoryItem">sth3 (0)</li>
        </ul>
    </div>
</template>

<style scoped>
    div{
        padding: 10px;
        margin-top:40px;
        background: url("/static/images.jpg");
    }
    .categoryItem{
        display:inline-block;
        width:110px;
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
        width:250px;
        margin-top:10px;
    }
</style>