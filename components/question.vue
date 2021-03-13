<template>
    <div>
        <h3 :href="`#collapse-${INDEX}`" data-toggle="collapse" @click="arrow = !arrow">{{QUESTION}} <span v-if="!arrow"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-right-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path fill-rule="evenodd" d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z"/></svg></span><span v-else><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-down-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/></svg></span></h3>
        <div :id="`collapse-${INDEX}`" class="container-fluid collapse">
            <div class="row justify-content-center text-center">
                <p v-for="(answer, index) in ANSWER" :key="index">{{answer}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: 'question',
    props:{
        QUESTION: {
            type: String,
            default: ""
        },
        ANSWER: {
            type: Array,
            default: null
        },
        INDEX:{
            type: String,
            default: ""
        }
    },
    data(){
        return{
            arrow: false
        }
    }
}
</script>

<style>
@media screen and (min-width:600px){
    h3{
        font-size:24px;
    }
}

@media screen and (max-width:600px){
    h3{
        font-size:16px;
    }
}

.card:hover{
    background-color:grey;
}
.card{
    background-color:lightgrey;
}
</style>