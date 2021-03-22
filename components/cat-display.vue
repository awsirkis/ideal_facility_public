<template>
<div>
    <table class="table table-striped table-dark" v-if="ready">
        <thead>
            <tr>
                <th v-if="!edit">{{item.name}}</th>
                <input class="form-control" v-model="item.name" type="text" v-if="edit && $store.getters.role == 1">
                <td class="btn btn-danger" @click="del()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></td>
                <td class="btn btn-success" @click="add()" v-if="$store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></td>
                <td class="btn btn-primary" @click="edit = true" v-if="!edit &&$store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width='16' height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></td>
                <td class="btn btn-primary" @click="push()"  v-else-if="$store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></td>
            </tr>
        </thead>
        <tbody v-if="this.docs.length">
            <tr v-for="(doc, index) in docs" :key="`${index}-document`">
                <td class="btn btn-danger" @click="rem(index)" v-if="$store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></td>
                <td v-if="!e.includes(index)"><nuxt-link :to="`/doc?id=${doc.id}`">{{doc.name}}</nuxt-link></td>
                <td v-else><input type="text" v-model="doc.name" class='form-control'></td>
                <td class='btn btn-primary' @click="e.push(index)" v-if="!e.includes(index) && $store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></td>
                <td class='btn btn-primary' @click="change(index)" v-else-if="$store.getters.role == 1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></td>
            </tr>
        </tbody>
        <div class="container fluid" v-else>
            <div class="row justify-content-center">
                <div class="loader"></div>
            </div>
        </div>
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
            e: [],
            childrenReady: false
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
        this.ready=true
        params.mode = 'list'
        this.docs = await this.$axios.$get('/api/file2/doc',{params:params})
        this.childrenReady=true
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