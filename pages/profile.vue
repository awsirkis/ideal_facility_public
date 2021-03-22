<template>
    <main>
        <div id="profile-body">
      <h1>Profile</h1>
      <div v-if="$store.getters.isAuth">
        <div class="col-12">
            <p><b>Username:</b> {{$store.getters.username}}</p>
        </div>
        <div class='col-12'>
          <p><b>Name:</b> <span v-if="!SHOWNAME">{{NAME}}     <a @click="SHOWNAME = true" class="a"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></a></span><input v-else type='text' class="form-control" v-model="NAME"></p>
          <button class="btn btn-danger" @click="name" v-if="SHOWNAME">Confirm Change</button>
        </div>
        <div class='col-12'>
          <p><b>Password:</b> <span v-if="!SHOWPASS"> <a @click="SHOWPASS = true" class="a"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></a></span><input v-else type='text' class="form-control" v-model="PASSWORD"></p>
          <button class="btn btn-danger" @click="password" v-if="SHOWPASS">Confirm Change</button>
        </div>
        <div class="col-12">
            <p><b>Email:</b> <span v-if="!SHOWEMAIL">{{EMAIL}}<a @click="SHOWEMAIL = true" class="a"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg></a></span><input v-else type='text' class="form-control" v-model="EMAIL"></p>
            <button class="btn btn-danger" @click="email" v-if="SHOWEMAIL">Confirm Change</button>
        </div>
      </div>
      </div>
    </main>

</template>

<script>
export default {
  data(){
    return{
      NAME: null,
      PASSWORD: null,
      EMAIL: null,
      PHONE: null,
      SHOWNAME: false,
      SHOWEMAIL: false,
      SHOWPASS: false
    }
  },
  mounted(){
    if(!this.$store.getters.isAuth){
      this.$router.push('/login')
    }
    this.NAME = this.$store.getters.name
    this.EMAIL = this.$store.getters.email
  },
  head () {
    return {
      title: 'Profile',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        { name: 'description', content: 'View logged-in profile' },
      ]
    }
  },
  methods:{
    async name(){
            const params={
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                name: this.NAME,
                id: this.$store.getters.id
            }
            const res = await this.$axios.$put('/api/file2/user-name',{},{params: params})
            this.SHOWNAME = false
        },
        async password(){
            const params={
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                new_pass: this.PASSWORD,
                id: this.$store.getters.id
            }
            const res = await this.$axios.$put('/api/file2/user-password',{},{params: params})
            this.SHOWPASS = false
        },
        async email(){
            const params={
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                email: this.EMAIL,
                id: this.$store.getters.id
            }
            const res = await this.$axios.$put('/api/file2/user-email',{},{params: params})
            this.SHOWMEAIL = false
        }
  }
}
</script>

<style>

#profile-body{
    background-color: white;
    color: black;
    min-width: 100%;
    padding:15px;
    border-radius: 15px;
}
</style>