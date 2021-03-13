<template>
<main>
    <div v-if="ready">
        <h1 v-if="!edit">{{doc.name}}</h1>
        <button class="btn btn-primary" @click="edit = true" v-if="!edit">Edit</button>
        <button class="btn btn-primary" @click="push()" v-else>Push</button>
        <a class="btn btn-success" :href="doc.data" :download="doc.name" v-if="doc.data && !edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg></a>
        <input type="text" v-model="doc.name" class="form-control" v-if="edit">
        <input type="file" @change="preview()" id="file" v-if="edit" class="form-control">
        
        <div class="container fluid" v-if="edit && reading">
            <div class="row justify-content-center">
                <div class="loader"></div>

            </div>

        </div>
        <embed :src="doc.data" width="100%">
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
        this.ready = true
    },
    data(){
        return{
            doc: null,
            ready: false,
            edit: false,
            reading: false
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