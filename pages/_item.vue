<template>
<main>
    <div v-if="ready">
        <h1>{{item.name}}</h1>
        <button class="btn btn-success" @click="add()" style="margin-bottom:15px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></button>
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-4" v-for="(category, index) in categories" :key="`${index}-category`">
                    <catdisplay :ID="category.id"/>
                </div>
            </div>
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
import catdisplay from '~/components/cat-display'
export default{
    components:{
        catdisplay
    },
    head(){
        return{
            title: 'Item'
        }
    },
    async mounted(){
        let params ={
            mode:'single',
            id: this.$route.params.item,
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.item = await this.$axios.$get('/api/file2/product',{params: params})
        params.mode = 'all'
        this.categories = await this.$axios.$get('api/file2/category',{params:params})
        console.log(this.categories)
        this.ready = true
    },
    data(){
        return{
            item:null,
            categories:[],
            ready: false
        }
    },
    methods:{
        async add(){
            const params = {
                name:"",
                id:this.$route.params.item,
                username: this.$store.getters.username,
                password: this.$store.getters.password,
            }
            this.categories.push({
                name:"",
                id:0,
                parent:0
            })
            this.categories[this.categories.length-1] = await this.$axios.$post('/api/file2/category',{},{params:params})
            console.log(this.categories)
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