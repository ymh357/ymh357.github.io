<template>
    <div>
        <h2>Demo Pages</h2>
        <demo-div></demo-div>
        <demo-div :demo="pintuDemo"></demo-div>
    </div>
</template>

<script>
    import DemoDiv from '../components/DemoDiv.vue'
    export default {
        components: {
            'demo-div': DemoDiv
        },
        data (){
            return{
                pintuDemo:{
                    imgUrl: '/static/pintu.jpg',
                    name: '拼图游戏',
                    introduction: '从自己的电脑中选择一张图片，然后就可以生成以这个图片作为素材的拼图。拖动拼图块并交换位置，完成拼图吧！',
                    link: ''
                }
            }
        }
    }
</script>