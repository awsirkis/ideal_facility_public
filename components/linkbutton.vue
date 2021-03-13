<template>
    <div class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
        <div class="card">
            <nuxt-link :to="LNK">
                <img alt="image" :src="src" class="card-img-top">
                <div class="card-body" style="color: black;">
                    <h5 class="card-title">{{NAME}}</h5>
                    <p class="card-text d-none d-sm-block" v-if="DESCRIPTION != ''">{{DESCRIPTION}}</p>
                </div>    
            </nuxt-link> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'linkbutton',
    props:{
        SRC:{
            type: String,
            default:process.env.defaultImage
        },
        LNK:{
            type: String
        },
        NAME:{
            type: String
        },
        DESCRIPTION:{
            type: String,
            default: ''
        }
    },
    computed:{
        src: function(){
            if(!this.SRC){
            return process.env.defaultImage
            }
            return this.SRC;
        }
    }
}
</script>

<style>
.card {
    background-color: #e8e8e8;
    color: black;
    padding: 5px;
    margin: 15px 0px;
    text-decoration: none;
}

.card:hover {
    text-decoration: none;
    background-color: #b8b8b8;
}
.card-title{
    border-bottom: 2px solid grey;
}
.card a:hover{
    color: black;
    text-decoration: none !important;
}
.card a{
    color: black;
}
</style>