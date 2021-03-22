<template>
<main>
    <div class="create w-100" style="padding: 15px;border-bottom-left-radius:0;border-bottom-right-radius:0;">
        <h1>Create User</h1>
        <div class="row">
            <div class="col-12">
                <input type="text" class="form-control" v-model="name" name="name" placeholder="Name" required>
            </div>
            <div class="col-12">
                <input type="email" class="form-control" v-model="email" name="email" placeholder="Email" required>
            </div>
            <div class="col-12 row w-100 row justify-content-around">
                <button  class="col-2 btn btn-secondary" @click='create'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></button>
            </div>
        </div>
    </div>
    <table class="table table-striped table-dark" v-if="ready">
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Enabled</th>
                <th>Admin</th>
                <th>ID</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in users" :key="`${index}-user`">
                <td class="edit" @click="edit.push(index)" v-if="!edit.includes(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></td>
                <td class="edit" v-else @click="push(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg></td>
                <td v-if="edit.includes(index)"><input class="form-control" type="text" v-model="item.name" placeholder="Name"></td>
                <td v-else>{{item.name}}</td>
                <td v-if="edit.includes(index)"><input class="form-control" type="email" v-model="item.email" placeholder="Email"></td>
                <td v-else>{{item.email}}</td>
                <td><label class="switch">
                        <input type="checkbox" v-model="item.enabled" v-if="edit.includes(index)">
                        <input type="checkbox" v-model="item.enabled" v-else disabled>
                        <span class="slider round"></span>
                    </label></td>
                <td><label class="switch">
                        <input type="checkbox" v-model="item.admin" v-if="edit.includes(index)">
                        <input type="checkbox" v-model="item.admin" v-else disabled>
                        <span class="slider round"></span>
                    </label></td>
                <td>{{item.id}}</td>
                <td class="edit" @click="reset(index)">Reset</td>
                <td class="edit" @click="del(index)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></td>
            </tr>
        </tbody>
    </table>
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
        return {
            title: 'Admin',
            meta: [
                { name: 'description', content: 'List of Students' },
                {
                name: 'keywords', content: 'karate, okinawan, Everett, tuite, kali, silat, JKD, muay thai, WA, washington, washington state, snohomish, judo, BJJ,jiujitsu,jiu-jitsu, brazilian,jiu,jitsu, aikido, aikijitsu, iaido, iaijitsu, tae,kwan,do, taekwando, krav,maga, boxing, filipino,boxing, law enforcement, military, martial, arts'
                },
                {
                    charset: 'UTF-8'
                },
                {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                }
            ],
    
    }
    },
    data(){
        return{
            name: null,
            email: null,
            phone: null,
            birthday: null,
            kana: null,
            ready: true,
            users:[],
            edit:[]
        }
    },
    methods:{
        async create(){
            const params = {
                name: this.name, 
                email: this.email
            }
            const res = await this.$axios.$post(`/api/file2/user`,{},{params: params})
            this.users.push(res)
        },
        async getUsers(){
            const fetch= require('node-fetch')
            const params = {
                username:this.$store.getters.username,
                password: this.$store.getters.password
            }
            console.log(params)
            const res = await this.$axios.$get(`/api/file2/user`,{params: params})
            this.users = res
            for(let i = 0; i < this.users.length; ++i)
                this.users[i].admin = (this.users[i].role == 4)
            console.log(res)

        },
        async push(index){
            this.edit.splice(this.edit.indexOf(index), 1)
            console.log(this.users[index].admin, this.users[index].role)
            const params = {
                name: this.users[index].name,
                role: this.users[index].admin ? 4 : 1,
                email: this.users[index].email,
                enabled: this.users[index].enabled,
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.users[index].id
            }
            const res = await this.$axios.$put(`/api/file2/user`,{},{params: params})
            this.users[index] = res
            console.log(res)
        },
        async reset(index){
            const fetch = require("node-fetch")
            const params = {
                username: this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.users[index].id
            }
            const res = await this.$axios.$put(`/api/file2/reset`,{},{params: params})
            this.users[index] = res
        },
        async del(index){
            const fetch = require("node-fetch")
            const params={
                username:this.$store.getters.username,
                password: this.$store.getters.password,
                id: this.users[index].id
            }
            const res = await this.$axios.$delete(`/api/file2/user`,{params: params})
            this.users.splice(index, 1)
        }
    },
    async mounted(){
        await this.getUsers()
    }
}

</script>

<style>
.create{
  background-color:white;
  color:black;
  border-radius: 15px;
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
.edit:hover{
    cursor: pointer;
}
	.confbox
	{
		visibility:hidden;
		width:300px;height:300px;
		z-index:999;
		position:absolute;
		display:block;
		top:30%;
		left:30%;
	}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgb(85, 185, 92);
}

input:focus + .slider {
  box-shadow: 0 0 1px  rgb(85, 185, 92);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>