<template>
<main>
    <h1>Ideal Facility</h1>
    <p>Use this website to view documentation for Ideal Facility products and services. Navigate below to view products.</p>
    <div class='row justify-content-center'>
        <nuxt-link class="btn btn-success" to="/departments" v-if="$store.getters.isAuth">View departments</nuxt-link>
        <nuxt-link class="btn btn-success" to="/login" v-else>Login to View Documents</nuxt-link>
    </div>
</main>
</template>

<script>
export default {
    head(){
        return{
            title:'Ideal Facility'
        }
    }
}
</script>