
<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="position:sticky;top:0;z-index:5">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="nav-item">
        <nuxt-link class="nav-link" to="/">Home</nuxt-link>
      </li>
      <li class="nav-item" v-if="$store.getters.isAuth">
        <nuxt-link class="nav-link" to="/departments">Departments</nuxt-link>
      </li>
      <li class="nav-item" v-if="$store.getters.isAuth">
        <nuxt-link class="nav-link" to="/search">Search</nuxt-link>
      </li>
      <li class="nav-item" v-if="!$store.getters.isAuth">
        <nuxt-link class="nav-link" to="login">Login</nuxt-link>
      </li>
      <li class="nav-item" v-else>
        <nuxt-link class="nav-link" to="profile">Profile</nuxt-link>
      </li>
      <li class="nav-item dropdown" v-if="$store.getters.role == 1">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Admin
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <nuxt-link class="dropdown-item" to="/admin">Users</nuxt-link>
          <nuxt-link class="dropdown-item" to="/admin-doc">Docs</nuxt-link>
        </div>
      </li>
      <li class="nav-item dropdown" v-if="$store.getters.isAuth">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Departments
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <nuxt-link class="dropdown-item" to="/search?department=1">Department 1</nuxt-link>
          <nuxt-link class="dropdown-item" to="/search?department=2">Department 2</nuxt-link>
          <nuxt-link class="dropdown-item" to="/search?department=3">Department 3</nuxt-link>
        </div>
      </li>
      <li class="nav-item" v-if="$store.getters.isAuth">
        <a class="nav-link" to="#" @click="$store.dispatch('logout');$router.push('/')">Log Out</a>
      </li>
    </ul>
  </div>
</nav>
</template>

<style>
nav{
  position: fixed;
  top: 0;
  width: 100%;
}
</style>