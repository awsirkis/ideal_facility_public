<template>
<div>
    <table class="table table-striped table-dark" v-if="ready">
        <thead class="thead-light">
            <tr>
                <th v-if="!edit">{{item.name}}</th>
                <input class="form-control" v-model="item.name" type="text" v-if="edit && $store.getters.role == 1">
                <td class="btn btn-success" @click="add()" v-if="$store.getters.role == 1">+</td>
                <td class="btn btn-primary" @click="edit = true" v-if="!edit &&$store.getters.role == 1">Edit</td>
                <td class="btn btn-primary" @click="push()"  v-else-if="$store.getters.role == 1">Push</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(doc, index) in docs" :key="`${index}-document`">
                <td class="btn btn-danger" @click="rem(index)" v-if="$store.getters.role == 1">X</td>
                <td v-if="!e.includes(index)"><nuxt-link :to="`/doc?id=${doc.id}`">{{doc.name}}</nuxt-link></td>
                <td v-else><input type="text" v-model="doc.name" class='form-control'></td>
                <td class='btn btn-primary' @click="e.push(index)" v-if="!e.includes(index) && $store.getters.role == 1">Edit</td>
                <td class='btn btn-primary' @click="change(index)" v-else-if="$store.getters.role == 1">Push</td>
            </tr>
        </tbody>
    </table>
    <div class="container fluid" v-else>
        <div class="row justify-content-center">
        <div class="loader"></div>

        </div>

    </div>
</div>

</template>

<script>
export default {
    data(){
        return{
            item:null,
            docs:[],
            ready: false,
            edit:false,
            e: []
        }
    },
    name:'catdisplay',
    props:{
        ID:{
            type: Number,
            default:""
        }
    },
    async mounted(){
        let params = {
            mode:'single',
            id: this.ID,
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.item = await this.$axios.$get('/api/file2/category',{params:params})
        params.mode = 'all'
        this.docs = await this.$axios.$get('/api/file2/doc',{params:params})
        console.log(this.docs)
        this.ready=true
    },
    methods:{
        async push(){
            const params = {
                name: this.item.name,
                id: this.ID,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/category',{},{params:params})
            this.edit = false
        },
        async rem(index){
            const params = {
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.docs[index].id
            }
            await this.$axios.$delete('/api/file2/doc',{params:params})
            this.docs.splice(index, 1)
        },
        async change(index){
            this.e.splice(this.e.indexOf(index),1)
            const params = {
                name: this.docs[index].name,
                id: this.docs[index].id,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/doc',{data: this.docs[index].data},{params:params})
        },
        async add(){
            const params = {
                id: this.ID,
                name:"",
                data:"",
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            this.docs.push(await this.$axios.$post('/api/file2/doc',{},{params:params}))
            console.log(this.docs)
            this.e.push(this.docs.length-1)
                
        }
    }
}
</script>


<style>

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid rgb(85, 185, 92); /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>