<template>
<div class="col-12 item" v-if="!deleted">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="product.name" placeholder="Name" v-if="edit">
        <h4 class="col-12" v-else-if="product.name">{{product.name}}</h4>
        <input class="form-control col-12" type="text" v-model="product.model" placeholder="Model #" v-if="edit">
        <p class="col-12" v-else-if="product.model">{{product.model}}</p>
        <input class="form-control col-12" type="text" v-model="product.assetTag" placeholder="Asset Tag #" v-if="edit">
        <p class="col-12" v-else-if="product.assetTag">{{product.assetTag}}</p>
        <input class="form-control col-12" type="file"  :id="`previewImage${product.id}`" v-if="edit" @change="previewImage">
        <embed class="col-12 col-lg-6" :src="product.thumbnail" v-if="preview && product.thumbnail">
        <button class="btn btn-primary" @click="addVideo">Add Category</button>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit">Edit</button>
        <button class="btn btn-success" @click="push" v-else>Confirm</button>
        <button class="btn btn-secondary" @click="preview = !preview" v-if="product.thumbnail">Show/Hide Thumbnail</button>
        <button class="btn btn-danger" @click="remove">Delete</button>
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
            this.deleted = true
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
            show: false,
            deleted: false
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