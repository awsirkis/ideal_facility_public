<template>
<main>
    <div v-if="ready">
        <h1 v-if="!edit">{{doc.name}}</h1>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></button>
        <button class="btn btn-primary" @click="push()" v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></button>
        <a class="btn btn-success" :href="doc.data" :download="doc.name" v-if="doc.data && !edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></a>
        <input type="text" v-model="doc.name" class="form-control" v-if="edit">
        <input type="file" @change="preview()" id="file" v-if="edit" class="form-control">
        
        <div class="container fluid" v-if="edit && reading">
            <div class="row justify-content-center">
                <div class="loader"></div>

            </div>

        </div>
        <embed :src="doc.data" width="100%">
        <div>
            <h2>Add Document Version</h2>
            <p>Upload filled out version of the document</p>
            <input type="text" v-model="newdoc.name" class="form-control">
            <input type="file" @change="newpreview()" id="newfile" class="form-control">
            <button class="btn btn-success" @click="pushNew">Push New</button>
        </div>
    </div>
    <div class="container fluid" v-else>
        <div class="row justify-content-center">
            <div class="loader"></div>

        </div>

    </div>
</main>
</template>

<script>
export default {
    head(){
        return{
            name: 'Doc',
        }
    },
    async mounted(){
        if(!this.$route.query.id)
            this.$router.push("/")
        const params = {
            id:this.$route.query.id,
            mode:'single',
            username:this.$store.getters.username,
            password:this.$store.getters.password
        }
        this.doc = await this.$axios.$get('/api/file2/doc',{params: params})
        this.newdoc.name = this.doc.name + ' ' + (new Date().toLocaleDateString('en-us'))
        console.log(this.doc)
        this.ready = true
    },
    data(){
        return{
            doc: null,
            ready: false,
            edit: false,
            reading: false,
            newdoc: {name: '', data:''}
        }
    },
    methods:{
        async push(){
            const params = {
                name: this.doc.name, 
                id:this.doc.id,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            await this.$axios.$put('/api/file2/doc',{data: this.doc.data},{params: params})
            this.edit = false
        },
        async pushNew(){
            const params = {
                name: this.newdoc.name, 
                id: this.doc.parent,
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            console.log(params.parent)
            await this.$axios.$post('/api/file2/doc',{data: this.newdoc.data},{params: params})
        },
        async preview(){
            this.reading = true
            const file = document.querySelector("#file").files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.doc.data=reader.result
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
            this.reading = false
        },
        async newpreview(){
            this.reading = true
            const file = document.querySelector("#newfile").files[0]
            const reader = new FileReader()
            var t = this
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                t.newdoc.data=reader.result
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
            this.reading = false
        },
    }
}
</script>

<style>
#list-body{
    background-color: lightgrey;
    color: black;
    padding-left:15px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
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