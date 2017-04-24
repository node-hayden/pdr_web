<template>
    <div>
        <div v-if="cHasData">
            AAA
        </div>
        <div v-else>
            BBB
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                dShow: this.list
            }
        },
        computed:{
            cHasData: function () {
                return this.list && this.list.length > 0
            }
        },
        props: ['list']
    }
</script>