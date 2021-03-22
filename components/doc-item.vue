<template>
<div class="col-12 item">
    <div v-if="ready">  
        <input class="form-control col-12" type="text" v-model="doc.name" placeholder="Name" v-if="edit">
        <h6 class="col-12" v-else>{{doc.name}}</h6>
        <input class="form-control col-12" type="file"  :id="`previewImage${doc.id}`" v-if="edit" @change="previewImage">
        <embed class="col-12 col-lg-6" :src="doc.data" v-if="preview && doc.data">
        <button class="btn btn-primary" @click="edit = true" v-if="!edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></button>
        <button class="btn btn-success" @click="push" v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></button>
        <button class="btn btn-secondary" @click="preview = !preview" v-if="doc.data"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
</svg></button>
        <a class="btn btn-success" :href="doc.data" :download="doc.name" v-if="doc.data && !edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></a>
        <button class="btn btn-danger" @click="remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>
        
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
            this.$destroy();
            this.$el.parentNode.removeChild(this.$el);
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