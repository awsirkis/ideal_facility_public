<template>
<div class="col-12 item" v-if="!deleted">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="department.name" placeholder="Name" v-if="edit">
        <h3 class="col-12" v-else>{{department.name}}</h3>
        <input class="form-control col-12" type="text" v-model="department.description" placeholder="Description" v-if="edit">
        <p class="col-12" v-else>{{department.description}}</p>
        <input class="form-control col-12" type="file"  :id="`previewImage${department.id}`" v-if="edit" @change="previewImage">
        <embed class="col-12 col-lg-6" :src="department.thumbnail" v-if="preview && department.thumbnail">
        <button class="btn btn-primary" @click="addVideo">Add Product</button>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit">Edit</button>
        <button class="btn btn-success" @click="push" v-else>Confirm</button>
        <button class="btn btn-secondary" @click="preview = !preview" v-if="department.thumbnail">Show/Hide Thumbnail</button>
        <button class="btn btn-danger" @click="remove">Delete</button>
        <h4 class="col-12 video-header" @click="show = !show" v-if="children.length > 0">Show Products ({{children.length}})</h4>
        <div v-if="show">
            <proItem :ID="item.id"  v-for="item in children" :key="`video-${item.id}`"/>
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
import proItem from '~/components/pro-item.vue'
export default {
    components:{
        proItem
    },
    props:{
        ID:{
            default: null
        }
    },
    methods:{
        async push(){
            const params = {
                name: this.department.name,
                description: this.department.description,
                id: this.department.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/department',{thumbnail: this.department.thumbnail},{params:params})
            this.edit = false
        },
        async remove(item){
            const params = {
                id: this.department.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$delete('/api/file2/department',{params:params})
            this.deleted = true
        },
        async addVideo(){
            const params = {
                parent: this.department.id,
                name:"",
                model:"",
                assetTag:"",
                thumbnail:"",
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            this.children.push(await this.$axios.$post('/api/file2/product',{},{params:params}))
        },
        async previewImage(){
            const file = document.querySelector("#previewImage" + this.department.id).files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.department.thumbnail = reader.result;
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
        this.department = await this.$axios.$get('/api/file2/department',{params:params})
        console.log(this.department)
        const pparams = {
            mode:'list',
            id:this.ID,
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.children = await this.$axios.$get('/api/file2/product',{params:pparams})
        if(this.department.name == ""){
            this.edit = true
        }
        this.ready = true
        
    },
    data(){
        return{
            department:null,
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
    padding-right:0;
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