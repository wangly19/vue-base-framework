/**
 * @class GenerateModel
 */
class GenerateModel {
  /** * @constructor */
  constructor () {
    /** @property resultStock model列表 */
    this.resultStock = []
  }

  getCurrentModelFile () {
    const getAllRequireContextFile = requireContext =>
      requireContext.keys().map(requireContext)
    const modelFiles = require.context('@/views', true, /model.js$/)
    const modelStock = getAllRequireContextFile(modelFiles)
    this.resultStock = modelStock
  }

  createMixinQueue () {
    const mixinQueue = [{
      name: 'useDisaptch',
      mixin: {
        methods: {
          useDispatch: this.dispatch
        }
      }
    }]
    if (this.resultStock.length > 0) {
      this.resultStock.forEach(model => {
        const transformMethods = {}
        const transformLoadingEffect = {}
        const { namespace, state = {}, actions = {} } = model.default
        Object.keys(actions).forEach(fun => {
          transformMethods[`${namespace}/${fun}`] = actions[fun]
          transformLoadingEffect[`${namespace}/${fun}`] = false
        })
        mixinQueue.push({
          name: namespace,
          mixin: {
            data: () => ({
              model: { ...transformLoadingEffect },
              [namespace]: { ...state }
            }),
            methods: {
              ...transformMethods
            }
          }
        })
      })
    } else {
      this.warning('没有找到mdoel数据')
    }
    return mixinQueue
  }

  dispatch (modelCursor, payload) {
    const [namespace, actionName] = modelCursor.split('/')
    return new Promise((resolve, reject) => {
      this.$set(this.model, `${namespace}/${actionName}`, true)
      this[`${namespace}/${actionName}`](this[namespace], {
        payload,
        set: this.$set
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
        .finally(() => {
          this.$set(this.model, `${namespace}/${actionName}`, false)
        })
    })
  }
}

const generateModel = new GenerateModel(['name'])
generateModel.getCurrentModelFile()
console.log(generateModel.createMixinQueue())
const currentModels = generateModel.createMixinQueue()

console.count()

export default currentModels
