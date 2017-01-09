import mergeDeep from '../mergeDeep'

describe('mergeDeep', function () {
  it('should merge object properties without affecting any object', function () {
    const obj1 = { a: 0, b: 1 }
    const obj2 = { c: 2, d: 3 }
    const obj3 = { a: 4, d: 5 }

    const expected = { a: 4, b: 1, c: 2, d: 5 }

    expect(mergeDeep({}, obj1, obj2, obj3)).to.deep.equal(expected)
    expect(expected).to.not.deep.equal(obj1)
    expect(expected).to.not.deep.equal(obj2)
    expect(expected).to.not.deep.equal(obj3)
  })

  it('should do a deep merge', function () {
    const obj1 = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } }
    const obj2 = { a: { b: 2, d: { f: 'f' } } }

    expect(mergeDeep(obj1, obj2)).to.deep.equal({a: { b: 2, c: 1, d: {e: 1, f: 'f'} }})
  })

  it('should not merge strings', function () {
    const obj1 = { a: 'foo' }
    const obj2 = { a: { b: 2, d: { f: 'f' } } }
    const obj3 = { a: 'bar' }

    const result = mergeDeep(obj1, obj2, obj3)

    expect(result.a).to.equal('bar')
  })

  it('should clone objects during merge', function () {
    const obj1 = { a: { b: 1 } }
    const obj2 = { a: { c: 2 } }

    const result = mergeDeep({}, obj1, obj2)

    expect(result).to.deep.equal({ a: { b: 1, c: 2 } })
    expect(result.a).to.not.deep.equal(obj1.a)
    expect(result.a).to.not.deep.equal(obj2.a)
  })

  it('should not merge an object into an array', function () {
    const obj1 = { a: { b: 1 } }
    const obj2 = { a: ['foo', 'bar'] }

    const result = mergeDeep({}, obj1, obj2)

    expect(result).to.deep.equal({ a: ['foo', 'bar'] })
  })

  it('should deep clone arrays during merge', function () {
    const obj1 = { a: [1, 2, [3, 4]] }
    const obj2 = { b: [5, 6] }

    const result = mergeDeep(obj1, obj2)

    expect(result.a).to.deep.equal([1, 2, [3, 4]])
    expect(result.a[2]).to.deep.equal([3, 4])
    expect(result.b).to.deep.equal(obj2.b)
  })

  it('should union when both values are array', function () {
    const obj1 = { a: [1, 2, [3, 4]] }
    const obj2 = { a: [5, 6] }

    const result = mergeDeep(obj1, obj2)

    expect(result.a).to.deep.equal([1, 2, [3, 4], 5, 6])
    expect(result.a[2]).to.deep.equal([3, 4])
  })

  it('should union when the first value is an array', function () {
    const obj1 = { a: [1, 2, [3, 4]] }
    const obj2 = { a: 5 }
    const obj3 = { a: 6 }

    const result = mergeDeep(obj1, obj2, obj3)

    expect(result.a).to.deep.equal([1, 2, [3, 4], 5, 6])
    expect(result.a[2]).to.deep.equal([3, 4])
  })

  it('should uniquify array values', function () {
    const obj1 = { a: ['foo'] }
    const obj2 = { a: ['bar'] }
    const obj3 = { a: 'foo' }

    const result = mergeDeep(obj1, obj2, obj3)

    expect(result.a).to.deep.equal(['foo', 'bar'])
  })

  it('should copy source properties', function () {
    expect(mergeDeep({ test: true }).test).to.be.true
  })

  it('should not clone objects created with custom constructor', function () {
    function TestType () { }
    const func = new TestType()
    expect(mergeDeep(func)).to.deep.equal(func)
  })
})
