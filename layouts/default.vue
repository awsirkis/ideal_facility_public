<template>
<div id="content">
    <logo />
    <navbar />
    <Nuxt />
    <foot/>
</div>
</template>

<script>
import logo from '~/components/Logo.vue'
import navbar from '~/components/Navbar.vue'
import foot from '~/components/footer.vue'
export default{
  components:{
    logo,
    navbar,
    foot
  }  
}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
html, body {
	margin: 0;
	padding: 0;
	width: 100%;
	overflow:overlay;
	overflow-x: hidden;
  min-height: 100%;
}
body, main{
  width: 100%;
  margin: 0;
  padding: 0;
}
main {
  background-color: #285c19;
  color: white;
  padding: 2% 10%;
  flex: 1 0 auto;
}
#content{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar-track{
  background: darkslategrey !important;
}
::-webkit-scrollbar-button{
  display:none;
}
::-webkit-scrollbar-thumb{
  background:#285c19;
}
</style>
