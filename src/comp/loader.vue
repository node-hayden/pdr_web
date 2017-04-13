<template>
    <div class="comp-mask-parent comp-mask-show">
        <div class="comp-mask-container comp-mask-gif">
            <img class="comp-mask-gif" src="../asset/comp/loader.gif">
        </div>
    </div>
</template>

<script>
    export default {
        props:["showLoader"],
        data: function(){
            return {
                "isShow":this.showLoader
            }
        },
        computed: {
            loaderClass: function () {
                return {
                    "comp-mask-parent": true,
                    'comp-mask-show': this.isShow,
                }
            }
        }
    }
</script>

<style lang="css">
    @import "../style/css/comp/mask.css";
</style>