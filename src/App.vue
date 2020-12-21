<template>
<div>
  <router-link to="/home" >home</router-link>
  <router-link to="/admin" >admin</router-link>

  <router-view/>
</div>
</template>

<script>

import '@/plugin/createModel'

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  })
}
</script>
