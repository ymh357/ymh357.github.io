<template>
        <div>
                <introduction></introduction>
                <categories></categories>
        </div>

</template>
<script>
    import Introduction from '../components/Introduction.vue'
    import Categories from '../components/Categories.vue'
    export default {
        components: {
            'introduction': Introduction,
            'categories': Categories
        }
    }
</script>