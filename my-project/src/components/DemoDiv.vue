<template>
    <div class="row">
        <div class="col-md-4">
            <img :src="demo.imgUrl" :alt="demo.name">
        </div>
        <div class="col-md-7 col-md-offset-1" id="description">
            <p><strong>{{demo.name}}</strong></p>
            <p>{{demo.introduction}}</p>
            <a :href="demo.link">查看 »</a>
        </div>
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
    div.row{
        border-bottom: 1px dashed #8c8c8c;
    }
    div#description{
        padding-top:10px;
    }
    img{
        width:100%;
    }
    strong{
        display: inline-block;
        color: #761c19;
    }

    a{
        color: #ce8483;
    }
</style>