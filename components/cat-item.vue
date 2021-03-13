<template>
<div class="col-12 item" v-if="!deleted">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="category.name" placeholder="Name" v-if="edit">
        <h5 class="col-12" v-else>{{category.name}}</h5>
        <button class="btn btn-primary" @click="add = true" v-if="!add">Add Documents</button>
        <input class="form-control" type="number" v-model="toAdd" v-else>
        <button class="btn btn-primary" @click="addVideo()" v-if="add">Add Documents</button>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit">Edit</button>
        <button class="btn btn-success" @click="push" v-else>Confirm</button>
        <button class="btn btn-danger" @click="remove">Delete</button>
        <h4 class="col-12 video-header" @click="show = !show" v-if="children.length > 0">Show Documents ({{children.length}})</h4>
        <div v-if="show">
            <docItem :ID="item.id"  v-for="item in children" :key="`video-${item.id}`"/>
        </div>
    </div>
    <div class="container fluid" v-else>
        <div class="row justify-content-center">
        <div class="loader"></div>

        </div>

    </div>
</div>
</template>

<script>
import docItem from '~/components/doc-item.vue'
export default {
    components:{
        docItem
    },
    props:{
        ID:{
            default:null
        }
    },
    methods:{
        async push(){
            const params = {
                name: this.category.name,
                id: this.category.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/category',{},{params:params})
            this.edit = false
        },
        async remove(item){
            const params = {
                id: this.category.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$delete('/api/file2/category',{params:params})
            this.deleted = true
        },
        async addVideo(){
            let l = this.children.length
            for(let i = 0; i < this.toAdd; ++i){
                
                const params = {
                    id: this.category.id,
                    name:this.category.name + ' ' + (l + i + 1),
                    data:"",
                    username:this.$store.getters.username,
                    password:this.$store.getters.password
                }
                this.children.push(await this.$axios.$post('/api/file2/doc',{},{params:params}))
            }
            
            this.add = false
            this.toAdd = 0
        }

    },
    async mounted(){
        const params={
            mode:'single',
            id:this.ID,
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.category = await this.$axios.$get('/api/file2/category',{params:params})
        const dparams = {
            id:this.ID,
            mode:'list',
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.children = await this.$axios.$get('/api/file2/doc',{params:dparams})
        if(this.category.name == ""){
            this.edit = true
        }
        this.ready = true
    },
    data(){
        return{
            category:null,
            ready: false,
            preview: false,
            children:[],
            edit: false,
            show: false,
            deleted: false,
            add: false,
            toAdd: 0,
        }
    }
}
</script>

<style>
.item{
    padding: 15px;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid rgb(241, 94, 94); /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-header:hover{
    cursor: pointer;
    text-decoration: underline;
}
</style>