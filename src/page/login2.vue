<template>
    <div class="fillcontain" v-loading="loading" style="background-color: #fff;">

    </div>
</template>



<script>
    import {
        baseUrl,
        baseImgPath
    } from "@/config/env";
    import {
        setStore,
        getStore,
        setLocal,
        getLocal,
        removeStore,
        removeLocal
    } from "../config/mUtils";
    import axios from 'axios'
    export default {
        data() {
            return {
                loading:true,
            };
        },
        created() {
            this.getUrl();
        },
        mounted() {

        },
        computed: {
        },
        watch:{

        },
        methods: {
            getUrl(){
                let BaseUrl = baseUrl;
                let signUrl = BaseUrl + "/api/Login/Index?";
                window.location.href = signUrl + "accessToken=" + this.$route.query.accessToken +"&language="+ this.$route.query.language+"&company="+this.$route.query.company;
                // axios.get(signUrl,{params:{
                //         accessToken : this.$route.query.accessToken,
                //         language : this.$route.query.language,
                //         company : this.$route.query.company
                //     }
                // }).then(function (response) {
                //
                // }).catch(function (error) {
            },
        },
        watch: {

        }
    };

</script>

