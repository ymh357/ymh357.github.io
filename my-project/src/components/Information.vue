<template>
    <div>
        <img class="brand" src="/static/Information_48px_1133047_easyicon.net.png">
        <h3>信息<small>Information</small></h3>
        <ul class="list-unstyled">
            <li class="infoItem">作者所用头像: <img class="inserted" src="../../static/lee_sin_512px_1128835_easyicon.net.png"/></li>
            <li class="infoItem">腾讯QQ: 756570396</li>
            <li class="infoItem">STH1: blabla</li>
            <li class="infoItem">STH2: blabla</li>
            <li class="infoItem">STH3: blabla</li>
            <li class="infoItem">STH4: blabla</li>
        </ul>
    </div>
</template>

<style scoped>
    div{
        padding: 10px;
        margin-top:40px;
        margin-bottom:40px;
        background-image: url("/static/images.jpg");
    }
    img.brand{
        float:left;
        height:25px;
        width:25px;
    }
    h3{
        display: inline;
    }
    img.inserted{
        height:50px;
        width:50px;
    }
    .infoItem{
        margin: 10px 0;
    }
</style>