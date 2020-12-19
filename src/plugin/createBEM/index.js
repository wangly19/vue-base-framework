
/*
 * @Autor: wangly19
 * @Description: BEM函数生成
 * @Date: 2020-12-08 00:37:44
 */
class CreateElement {
  constructor (name) {
    this.name = name
  }
}

class CreateBlock extends CreateElement {
  element (name) {
    console.log(`${this.name}__${name}`)
    return new CreateElement(`${this.name}__${name}`)
  }
}

const BEM = {
  block (name) {
    return new CreateBlock(name)
  }

}

BEM.b = BEM.block

// Chaining
BEM.block('foo') // foo
BEM.block('foo').element('bar') // foo__bar
