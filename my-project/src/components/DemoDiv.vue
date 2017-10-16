<template>
    <div>
        <img :src="demo.imgUrl" :alt="demo.name">
        <strong>{{demo.name}}</strong>
        <p>{{demo.introduction}}</p>
        <a :href="demo.link">查看 »</a>
    </div>
</template>

<script>
    export default {
        props: {
            demo: {
                type: Object,
                default() {
                    return {
                            imgUrl: '/static/brick.jpg',
                            name: '打砖块',
                            introduction: '使用html5画布canvas元素制作的经典的打砖块游戏，欢迎来尝试通关~',
                            link: ''
                    }
                }
            }
        }

    }
</script>

<style scoped>
    div{
        margin: 20px 20px;
        border-bottom: 1px dashed #8c8c8c;
        padding-bottom: 20px;
    }
    img{
        float: left;
        width:190px;
        height:120px;
    }
    strong{
        display: inline-block;
        margin:10px 0px 10px 20px;
        color: #761c19;
    }
    p{
        margin:10px 0px 10px 210px;
    }
    a{
        color: #ce8483;
        margin:10px 0px 10px 20px;
    }
</style>