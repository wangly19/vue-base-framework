<template>
  <div>111</div>
</template>

<script>
import { useServices } from 'framework'
const { getPerson } = useServices()
/**
 * @module 测试页面1
 * @page
 */
export default {
  name: 'home',
  created () {
    getPerson().then(res => {
      console.log(res)
      alert('接口请求成功')
    }, err => {
      console.log(err)
      alert('接口请求失败')
    })
  }
}
</script>
