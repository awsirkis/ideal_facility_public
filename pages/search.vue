<template>
<main>
    <div id=search-box>
        <h1>Search for Products</h1>
        <div id="search-body">
            <input type="text" class="form-control" v-model="term" placeholder="Search">
            <ul class="nav nav-pills nav-fill" style="background-color: lightgrey">
                <li class="nav-item" @click="sort = null">
                    <a class="nav-link active" href="#" v-if="sort === null">All Items</a>
                    <a class="nav-link" href="#" v-else>All Items</a>
                </li>
                <li class="nav-item" @click="sort = 'name'">
                    <a class="nav-link active" href="#" v-if="sort == 'name'">Name</a>
                    <a class="nav-link" href="#" v-else>Name</a>  
                </li>
                <li class="nav-item" @click="sort = 'model'">
                    <a class="nav-link active" href="#" v-if="sort == 'model'">Model #</a>
                    <a class="nav-link" href="#" v-else>Model #</a>  
                </li>
                <li class="nav-item" @click="sort = 'assetTag'">
                    <a class="nav-link active" href="#" v-if="sort == 'assetTag'">Asset Tag #</a>
                    <a class="nav-link" href="#" v-else>Asset Tag #</a>  
                </li>
            </ul>
        </div>
        <div id="result-body container-fluid align-content-left" v-if="ready">
            <div class="document row" v-for="(item, index) in list" :key="index" >
                <div class="col-3">
                    <img :src="item.thumbnail ? item.thumbnail : d" style="width: 100%">
                </div>
                <div class="col-9" v-if="edit.includes(index)">
                    <input type="text" placeholder="Name" v-model="item.name" class="form-control">
                    <input type="text" placeholder="Model #" v-model="item.model" class="form-control">
                    <input type="text" placeholder="Asset Tag #" v-model="item.assetTag" class="form-control">
                    <input type="file" :id="`file-${index}`" @change="preview(index)" class="form-control">
                    <button class="btn btn-primary" @click="push(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></button>
                    <button class="btn btn-danger" @click="del(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>
                </div>
                <div class="col-9" v-else>
                    <p><b>Name: </b>{{item.name}}</p>
                    <p><b>Model #: </b>{{item.model}}</p>
                    <p><b>Asset Tag #:</b> {{item.assetTag}}</p>
                    <nuxt-link class="btn btn-success" :to="`/${item.id}`">View Documents</nuxt-link>
                    <button class="btn btn-primary" v-if="$store.getters.role == 1" @click="edit.push(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></button>
                    <button class="btn btn-danger" v-if="$store.getters.role == 1" @click="del(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>
                </div>
            </div>
            <button class="btn btn-success" @click="add()" v-if="$route.query.department" style="margin-top:40px;">Add Product to Department</button>
        </div>
        <div class="container fluid" v-else>
            <div class="row justify-content-center">
                <div class="loader"></div>

            </div>

        </div>
    </div>
</main>
</template>

<script>
export default {
    head(){
        return {
            title: 'Search'
        }
    },
    async mounted(){
        let params = null
        if(this.$route.query.department)
            params={
                mode:"parent",
                username:this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.$route.query.department
            }
        else{
            params={
                mode:'all',
                username:this.$store.getters.username,
                password: this.$store.getters.password
            }
        }
        this.documents = await this.$axios.$get('/api/file2/product',{params:params})
        console.log(this.documents)
        this.ready = true
    },
    data(){
        return{
            term: '',
            sort: null,
            documents:[],
            d: process.env.defaultImage,
            ready: false,
            edit:[]
        }
    },
    computed:{
        list: function(){
            switch(this.sort){
                case 'name':
                    return this.documents.filter(obj => obj.name.toLowerCase().match(this.term.toLowerCase()))
                case 'model':
                    return this.documents.filter(obj => obj.model.toLowerCase().match(this.term.toLowerCase()))
                case 'assetTag':
                    return this.documents.filter(obj => obj.assetTag.toLowerCase().match(this.term.toLowerCase()))
                default:
                    return this.documents
            }
        }
    },
    methods:{
        async add(){
            this.documents.push({
                name:"",
                assetTag:"",
                model:"",
                thumbnail:"",
                id:0
            })
            const params = {
                name:this.documents[this.documents.length-1].name,
                assetTag:this.documents[this.documents.length-1].assetTag,
                model:this.documents[this.documents.length-1].model,
                thumbnail:this.documents[this.documents.length-1].thumbnail,
                parent: this.$route.query.department,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            this.documents[this.documents.length-1] = await this.$axios.$post('/api/file2/product',{},{params:params})
            this.edit.push(this.documents.length - 1)
        },
        async del(index){
            if(this.edit.includes(index))
                this.edit.splice(this.edit.indexOf(index),1)
            const params = {
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.documents[index].id
            }
            await this.$axios.$delete('/api/file2/product',{params:params})
            this.documents.splice(index, 1)
        },
        async push(index){
            this.edit.splice(this.edit.indexOf(index),1)
            const params = {
                id:this.documents[index].id,
                name: this.documents[index].name, 
                model: this.documents[index].model, 
                assetTag: this.documents[index].assetTag,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/product',{thumbnail: this.documents[index].thumbnail},{params:params})
        },
        async preview(index){
            const file = document.querySelector("#file-" + index).files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.documents[index].thumbnail=reader.result
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
}

</script>

<style>
#search-box{
    background-color: white;
    color: black;
    border-radius: 15px;
    padding: 2%;
}
#result-body, #search-body{
    padding: 20px 15px;
}
.document{
    border-bottom: 5px solid darkgrey;
    background-color: lightgrey;
}
.document:last-of-type{
    border-bottom: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}

.document:first-of-type{
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.nav-pills .nav-link.active{
    background-color:green;
}
a, a:hover{
    text-decoration: none;
    color: black;
}
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