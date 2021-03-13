<template>
<main>
    <div v-if="ready">
        <h1>{{item.name}}</h1>
        <button class="btn btn-success" @click="add()">Add Category</button>
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-4" v-for="(category, index) in categories" :key="`${index}-category`">
                    <button class="btn btn-danger" @click="del(index)" v-if="$store.getters.role == 1">X</button>
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
        if(!this.$route.query.id){
            this.$router.push('/')
        }
        let params ={
            mode:'single',
            id: this.$route.query.id,
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
        async del(index){
            const params = {
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.categories[index].id
            }
            await this.$axios.$delete('/api/file2/category',{params: params})
            this.categories.splice(index, 1)
        },
        async add(){
            const params = {
                name:"",
                id:this.$route.query.id,
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