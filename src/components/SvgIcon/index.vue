<template>
  <svg class="plugin-svg-icon"
       aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
/**
 * @module
 * @component
 * @name SVG图标组件
 * @description SVG图片组件，通过icons下的SVG图标名称引入对应的组件
 * @param { String } iconClass svg图标名称
 * @example <svg-icon icon-class="edit" />
*/
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * 图标类名拼接
     * @description 拼接svg图标名称
     * @function iconName
     * @memberof SvgIcon
     */
    iconName () {
      return `#icon-${this.iconClass}`
    }
  },
  methods: {
    // @function
    /**
     * @method test 测试用例
     */
    test () {}
  }
}
</script>

<style scoped>
.plugin-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
