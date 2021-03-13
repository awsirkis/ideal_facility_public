<template>
    <main>
        <div id="profile-body">
      <h1>Profile</h1>
      <div v-if="$store.getters.isAuth">
        <div class="col-12">
            <p><b>Username:</b> {{$store.getters.username}}</p>
        </div>
        <div class='col-12'>
          <p><b>Name:</b> <span v-if="!SHOWNAME">{{NAME}}     <a @click="SHOWNAME = true" class="a"> Edit</a></span><input v-else type='text' class="form-control" v-model="NAME"></p>
          <button class="btn btn-danger" @click="name" v-if="SHOWNAME">Confirm Change</button>
        </div>
        <div class='col-12'>
          <p><b>Password:</b> <span v-if="!SHOWPASS"> <a @click="SHOWPASS = true" class="a"> Edit</a></span><input v-else type='text' class="form-control" v-model="PASSWORD"></p>
          <button class="btn btn-danger" @click="password" v-if="SHOWPASS">Confirm Change</button>
        </div>
        <div class="col-12">
            <p><b>Email:</b> <span v-if="!SHOWEMAIL">{{EMAIL}}<a @click="SHOWEMAIL = true" class="a"> Edit</a></span><input v-else type='text' class="form-control" v-model="EMAIL"></p>
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