<template>
<div class="col-12 item">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="product.name" placeholder="Name" v-if="edit">
        <h4 class="col-12" v-else-if="product.name">{{product.name}}</h4>
        <input class="form-control col-12" type="text" v-model="product.model" placeholder="Model #" v-if="edit">
        <p class="col-12" v-else-if="product.model">{{product.model}}</p>
        <input class="form-control col-12" type="text" v-model="product.assetTag" placeholder="Asset Tag #" v-if="edit">
        <p class="col-12" v-else-if="product.assetTag">{{product.assetTag}}</p>
        <input class="form-control col-12" type="file"  :id="`previewImage${product.id}`" v-if="edit" @change="previewImage">
        <embed class="col-12 col-lg-6" :src="product.thumbnail" v-if="preview && product.thumbnail">
        <button class="btn btn-primary" @click="addVideo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></button>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></button>
        <button class="btn btn-success" @click="push" v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></button>
        <button class="btn btn-secondary" @click="preview = !preview" v-if="product.thumbnail"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
</svg></button>
        <button class="btn btn-danger" @click="remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>
        <h4 class="col-12 video-header" @click="show = !show" v-if="children.length > 0">Show Categories ({{children.length}})</h4>
        <div v-if="show">
            <catItem :ID="item.id"  v-for="item in children" :key="`video-${item.id}`"/>
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
import catItem from '~/components/cat-item.vue'
export default {
    components:{
        catItem
    },
    props:{
        ID:{
            default:null
        }
    },
    methods:{
        async push(){
            const params = {
                name: this.product.name,
                description: this.product.description,
                id: this.product.id,
                model: this.product.model,
                assetTag: this.product.assetTag,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/product',{thumbnail: this.product.thumbnail},{params:params})
            this.edit = false
        },
        async remove(item){
            const params = {
                id: this.product.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$delete('/api/file2/product',{params:params})
            this.$destroy();
            this.$el.parentNode.removeChild(this.$el);
        },
        async addVideo(){
            const params = {
                id: this.product.id,
                name:"",
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            this.children.push(await this.$axios.$post('/api/file2/category',{},{params:params}))
        },
        async previewImage(){
            const file = document.querySelector("#previewImage" + this.product.id).files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.product.thumbnail = reader.result;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }

    },
    async mounted(){
        const params={
            mode:'single',
            id:this.ID,
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.product = await this.$axios.$get('/api/file2/product',{params:params})
        const cparams = {
            id:this.ID,
            mode:'list',
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        if(this.product.name == ""){
            this.edit = true
        }
        this.children = await this.$axios.$get('/api/file2/category',{params:cparams})
        this.ready = true
    },
    data(){
        return{
            product:null,
            ready: false,
            preview: false,
            children:[],
            edit: false,
            show: false
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