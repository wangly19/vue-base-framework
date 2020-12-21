export default {
  namespace: 'Home',
  state: {
    move: {},
    a: 1,
    b: 2
  },
  actions: {
    /**
     *
     * @param { Object } state
     * @param { Object } payload
     * @param { function } set
     */
    async setUser (state, { payload, set }) {
      const data = await test()
      await set(state, 'move', data)
      console.log(state, payload, set)
      return state.move
    }
  }
}

const test = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        user: 'wangly',
        age: 21
      })
    }, 2000)
  })
}
