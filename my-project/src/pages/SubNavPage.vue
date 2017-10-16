<template>
        <div>
                <introduction></introduction>
                <categories></categories>
                <information></information>
        </div>

</template>
<script>
    import Introduction from '../components/Introduction.vue'
    import Categories from '../components/Categories.vue'
    import Information from '../components/Information.vue'
    export default {
        components: {
            'introduction': Introduction,
            'categories': Categories,
            'information': Information
        }
    }
</script>

<style scoped>
        div{
            padding-top:40px;
        }
</style>