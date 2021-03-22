<template>
<main>
    <div id="list-body" v-if="ready">
    <h1>Add Docs</h1>
        <depItem v-for="(item, index) in docs" :key="`${index}-department`" :ID="item.id"></depItem>
        <!--Change to Specific Types based on Router Query-->
        <button class="btn btn-primary" @click="addDepartment"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></button>
    </div>
    <div class="container fluid" v-else>
        <div class="row justify-content-center">
        <div class="loader"></div>

        </div>

    </div>
</main>
</template>

<script>
import depItem from '~/components/dep-item'
export default {
    components:{
        depItem
    },
    head(){
        return{
            title: 'Add Docs'
        }
    },
    data(){
        return{
            docs: [],
            edit:[],
            ready: false,
            children:[],
            add:[],
            loaded:0,
            total:0
        }
    },
    methods:{
        async addDepartment(){
            const params = {
                name:"",
                description:"",
                thumbnail:"",
                username: this.$store.getters.username,
                password: this.$store.getters.password
            }
            this.docs.push(await this.$axios.$post('/api/file2/department',{},{params:params}))
        }
    },
    async mounted(){
        const params={
            mode:"all",
            username: this.$store.getters.username,
            password: this.$store.getters.password
        }
        this.docs = await this.$axios.$get('/api/file2/department',{params:params})
        this.ready = true
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
.item{
    border: 2px solid grey;
    border-top: none;
    border-right:none;
}
.item:first-of-type{
    border-top: 2px solid grey;
    border-top-left-radius: 15px;
}
.item:last-of-type{
    
    border-bottom-left-radius: 15px;
}
path{
    fill:white;
}

.form-control{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
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