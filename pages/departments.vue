<template>
  <main>
    <div v-if="ready">
      <h1>Departments</h1>
      <p>Click on the department to view all products and documents.</p>
      <div class="container-fluid">
        <div class="row justify-content-center text-center">
          <linkbutton v-for="(dep, index) in departments" :LNK="`/search?department=${dep.id}`" :NAME="dep.name" :SRC="dep.thumbnail" :DESCRIPTION="dep.description" :key="index"/>
        </div>
      </div>
      <h1 v-if="$store.getters.role == 1">Add Departments</h1>
      <table class="table table-dark table-striped" v-if="$store.getters.role == 1">
        <tr v-for="(dep, index) in departments" :key="index">
          <td class='btn btn-danger' @click="del(index)">Delete</td>
          <td v-if="edit.includes(index)"><input type="text" class="form-control" v-model="dep.name"></td>
          <td v-else>{{dep.name}}</td>
          <td v-if="edit.includes(index)"><input type="text" class="form-control" v-model="dep.description"></td>
          <td v-else>{{dep.description}}</td>
          <td v-if="edit.includes(index)"><input type="file" :id="`file-${index}`" class="form-control" @change="preview(index)"></td>
          <td class="btn btn-primary" @click="push(index)" v-if="edit.includes(index)">Push</td>
          <td class="btn btn-primary" @click="edit.push(index)" v-else>Edit</td>
        </tr>
        <tr>
          <td class="btn btn-success" @click="add()">Add</td>
        </tr>
      </table>
    </div>
    <div class="container fluid" v-else>
        <div class="row justify-content-center">
        <div class="loader"></div>

        </div>

    </div>
  </main>
</template>

<script>
  import linkbutton from '~/components/linkbutton.vue'
export default {
  head(){
    return{
      title:'Ideal Facility',
      meta:[
        {name:'description', content:'Ideal Criticial Facility Services'}
      ]
    }
  },
  components:{
    linkbutton
  },
  data(){
    return{
      departments:[],
      ready:false,
      edit:[]
    }
  },
  async mounted(){
    const params={
        mode:'all',
        username: this.$store.getters.username,
        password: this.$store.getters.password
    }
    this.departments = await this.$axios.$get('/api/file2/department',{params: params})
    this.ready = true
  },
  methods:{
    async del(index){
      if(this.edit.includes(index)){
          this.edit.splice(this.edit.indexOf(index))
      }
      const params = {
          username: this.$store.getters.username,
          password: this.$store.getters.password,
          id: this.departments[index].id
      }
      await this.$axios.$delete('/api/file2/department',{params:params})
      this.departments.splice(index, 1)
    },
    async push(index){
      this.edit.splice(this.edit.indexOf(String([index])),1)
      const params = {
          id: this.departments[index].id,
          name: this.departments[index].name, 
          description: this.departments[index].description,
          username: this.$store.getters.username,
          password: this.$store.getters.password
      }
      await this.$axios.$put('/api/file2/department',{thumbnail: this.departments[index].thumbnail},{params:params})
    },
    async add(){
      this.departments.push({
        id: 0,
        name:"",
        thumbnail:"",
        description:""
      })
      const params = {
          name: this.departments[this.departments.length-1].name, 
          thumbnail: this.departments[this.departments.length-1].thumbnail, 
          description: this.departments[this.departments.length-1].description,
          username: this.$store.getters.username,
          password: this.$store.getters.password
      }
      this.departments[this.departments.length-1] = await this.$axios.$post('/api/file2/department',{},{params:params})
      this.edit.push(this.departments.length-1)
    },
    async preview(index){
      const file = document.querySelector(`#file-${index}`).files[0]
      const reader = new FileReader()
      var t = this
      reader.addEventListener("load", function () {
          // convert image file to base64 string
          t.departments[index].thumbnail=reader.result
      }, false);

      if (file) {
          reader.readAsDataURL(file);
      }
    }
  }

}
</script>

<style>

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
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
