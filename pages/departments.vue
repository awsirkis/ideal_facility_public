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
          <td class='btn btn-danger' @click="del(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></td>
          <td v-if="edit.includes(index)"><input type="text" class="form-control" v-model="dep.name"></td>
          <td v-else>{{dep.name}}</td>
          <td v-if="edit.includes(index)"><input type="text" class="form-control" v-model="dep.description"></td>
          <td v-else>{{dep.description}}</td>
          <td v-if="edit.includes(index)"><input type="file" :id="`file-${index}`" class="form-control" @change="preview(index)"></td>
          <td class="btn btn-primary" @click="push(index)" v-if="edit.includes(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
</svg></td>
          <td class="btn btn-primary" @click="edit.push(index)" v-else><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></td>
        </tr>
        <tr>
          <td class="btn btn-success" @click="add()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></td>
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
    console.log(params)
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
