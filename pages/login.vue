<template>
<main>
    <div id="login">
        <div id="login-body" v-if="state == 'login'">
            <h1 class="login-header">Login</h1>
            <input class="form-control login-form" type="text" placeholder="Username" v-model="username" required>
            <input class="form-control login-form" type="password" placeholder="Password" v-model="password" required>
            <p class="error" v-if="err != null">Username or Password Incorrect</p>
            <div id="login-footer" class="login-form">
                <button @click="login"  class="btn btn-success">Log In</button>
                <button @click="state='reset'" class="btn btn-secondary">Forgot Password</button>
            </div>
        </div>
        <div id="reset-body" v-if="state == 'reset'">
          <h1 class="login-header">Reset Password</h1>
          <p>Sends an email with a new generated password.</p>
          <input class="form-control login-form" type="text" placeholder="Email" v-model="username" required>
          <button @click="reset" class="btn btn-success">Send New Password</button>
        </div>
    </div>
    </main>
</template>
<script>
export default {
    head () {
    return {
      title: 'Login',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        { name: 'description', content: 'Cascade Martial Arts is an Everett-based dojo of the OSMKKF that specializes in Karate, Kali/Silat, JKD, Throwing, and Muay Thai' },
        
      ]
    }
  },
    data(){
      return{
          username: '',
          password: '',
          state: 'login',
          err: null
      }
    },
    async mounted(){
    },
    methods:{
      async login(){
        assetTag
        const params = {username:this.username,email:this.password}
        const res = await this.$axios.get(`/api/file2/signin`,{params: params})
        if(res.status == 200){
          this.$store.dispatch('login', {user: res.data})
          this.$router.push('/profile')
        }
        else{
          this.err = true
        }
      },
      async reset(){
        assetTag
        const params={
            action:'reset',
            email: this.username

        }
        const res = await fetch('/.netlify/functions/user', {method:'POST', body: JSON.stringify(params)})
      }
    }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-width: 100%;
  padding: 15px;
}

.error {
  color: red;
}

.valid {
  color: green
}

#login-body, #reset-body{
    background-color: white;
    min-width: 100%;
    padding:15px;
    border-radius: 15px;
}

#login{
    min-width: 100%;
    color: black;
    border-radius: 15px;
}

.login-header{
    border: none;
}

#login-fail{
  color: red;
}

.login-form, .recovery-footer{
  margin-top: 15px;
}

</style>

