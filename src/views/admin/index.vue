<template>
  <div>
    <v-data-table
      v-if="!model['Admin/getDesserts']"
      :headers="Admin.headers"
      :items="Admin.mockTabData"
    ></v-data-table>
    <v-sheet v-else>
      <v-skeleton-loader :boilerplate="false" type="table"></v-skeleton-loader>
    </v-sheet>
  </div>
</template>

<script>
import { useModels, useServices } from 'framework'
/**
 * @module 测试页面2
 * @page
 */
const Admin = {
  created () {
    console.log(this.Admin)
    this.useDispatch('Admin/getDesserts').then(() => {
      console.log(this.Admin)
    })
  },
  data: () => ({
    /** @type { boolean } 当前是否折扣  */
    discount: false,
    /** @type { number } 当前tab页面 */
    currentTab: 1
  }),
  methods: {
    /**
     * 获取用户数据
     * @method getPersonData
     * @returns { void } - 无返回结果
     */
    async getPersonData () {
      const [, err] = await useServices('getPerson')
      if (err) {
        alert('接口请求失败')
      } else {
        alert('接口请求成功')
      }
    }
  }
}
export default useModels(Admin, ['Admin'])
</script>
