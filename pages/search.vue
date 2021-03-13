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
                    <button class="btn btn-primary" @click="push(index)">Push</button>
                    <button class="btn btn-danger" @click="del(index)">Delete</button>
                </div>
                <div class="col-9" v-else>
                    <p><b>Name: </b>{{item.name}}</p>
                    <p><b>Model #: </b>{{item.model}}</p>
                    <p><b>Asset Tag #:</b> {{item.assetTag}}</p>
                    <nuxt-link :to="`/item?id=${item.id}`">Link >></nuxt-link>
                    <button class="btn btn-primary" v-if="$store.getters.role == 1" @click="edit.push(index)">Edit</button>
                    <button class="btn btn-danger" v-if="$store.getters.role == 1" @click="del(index)">Delete</button>
                </div>
            </div>
            <button class="btn btn-success" @click="add()" v-if="$route.query.department">Add Product to Department</button>
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
                    return this.documents.filter(obj => obj.name.match(this.term))
                case 'model':
                    return this.documents.filter(obj => obj.model.match(this.term))
                case 'assetTag':
                    return this.documents.filter(obj => obj.assetTag.match(this.term))
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