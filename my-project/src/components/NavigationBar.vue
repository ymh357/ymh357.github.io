<template>
    <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><img src="/static/lee_sin_512px_1128835_easyicon.net.png">Ymh的个人博客</a>
            </div>
            <div class="collapse navbar-collapse" id="navbar">
                <ul class="nav navbar-nav">
                    <li :class="activeItem=='home'?'active':''"><a @click="setActive($event.target.text)" href="#/page1">Home</a></li>
                    <li :class="activeItem=='demo'?'active':''"><a @click="setActive($event.target.text)" href="#/page2">Demo Page</a></li>
                    <li :class="activeItem=='about'?'active':''"><a @click="setActive($event.target.text)" href="#/page3">About</a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        data (){
            return {
                activeItem: 'home'
            }
        },
        methods: {
            setActive: function(value){
                switch (value){
                    case 'Home':
                        this.activeItem='home';
                        break;
                    case 'About':
                        this.activeItem='about';
                        break;
                    default:
                        this.activeItem='demo';
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    nav{
        /*background-image: url("../assets/xz.jpg");*/
        background: none;
        border:none;
    }
    .navbar-brand>img{
        display: inline;
        height: 30px;
        width: 30px
    }
    .navbar-nav{
        float: right;
    }
</style>