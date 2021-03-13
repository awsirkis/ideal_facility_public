<template>
<div class="col-12 item" v-if="!deleted">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="doc.name" placeholder="Name" v-if="edit">
        <h6 class="col-12" v-else>{{doc.name}}</h6>
        <input class="form-control col-12" type="file"  :id="`previewImage${doc.id}`" v-if="edit" @change="previewImage">
        <embed class="col-12 col-lg-6" :src="doc.data" v-if="preview && doc.data">
        <button class="btn btn-primary" @click="edit = true" v-if="!edit">Edit</button>
        <button class="btn btn-success" @click="push" v-else>Confirm</button>
        <button class="btn btn-secondary" @click="preview = !preview" v-if="doc.data">Show/Hide Document</button>
        <a class="btn btn-success" :href="doc.data" :download="doc.name" v-if="doc.data && !edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></a>
        <button class="btn btn-danger" @click="remove">Delete</button>
        
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
                name: this.doc.name,
                id: this.doc.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/doc',{data: this.doc.data},{params:params})
            this.edit = false
        },
        async remove(item){
            const params = {
                id: this.doc.id,
                username:this.$store.getters.username,
                password:this.$store.getters.password
            }
            await this.$axios.$delete('/api/file2/doc',{params:params})
            this.deleted = true
        },
        async previewImage(){
            const file = document.querySelector("#previewImage" + this.doc.id).files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.doc.data = reader.result;
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
        this.doc = await this.$axios.$get('/api/file2/doc',{params:params})
        if(this.doc.data == ""){
            this.edit = true
        }
        this.ready = true
    },
    data(){
        return{
            doc:null,
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