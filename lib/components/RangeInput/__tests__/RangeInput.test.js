import React from 'react'
import RangeInput from '../index'

describe('<RangeInput />', function () {
  const testbed = new Testbed(
    <RangeInput label="Opacity" name="opacity" max={100} min={0} />
  )

  it('renders an input with type "range"', function () {
    const subject = testbed.render()

    expect(subject.find('input').getDOMNode().type)
      .to.equal('range')
  })

  it('displays the default value', function () {
    const subject = testbed.render({
      defaultValue: 42
    })

    expect(subject.find('output').text())
      .to.equal('42')
  })

  it('sets input value to default value', function () {
    const subject = testbed.render({
      defaultValue: 25
    })

    expect(subject.find('input').getDOMNode().value)
      .to.equal('25')
  })

  it('sets input value to controlled value', function () {
    const subject = testbed.render({
      value: 25,
      onChange: () => {}
    })

    expect(subject.find('input').getDOMNode().value)
      .to.equal('25')
  })

  it('sets min value', function () {
    const subject = testbed.render({
      min: 25
    })

    expect(subject.find('input').getDOMNode().min)
      .to.equal('25')
  })

  it('sets max value', function () {
    const subject = testbed.render({
      max: 75
    })

    expect(subject.find('input').getDOMNode().max)
      .to.equal('75')
  })

  it('sets step value', function () {
    const subject = testbed.render({
      step: 5
    })

    expect(subject.find('input').getDOMNode().step)
      .to.equal('5')
  })

  it('requires an `onChange` prop with a `value` prop', function () {
    let error = false
    try {
      testbed.render({
        value: 50
      })
    } catch (e) {
      error = true
    }

    expect(error).to.be.true
  })

  it('formats the value displayed', function () {
    const subject = testbed.render({
      defaultValue: 45,
      formatValue: function (value) {
        return value + '%'
      }
    })

    expect(subject.find('output').text())
      .to.equal('45%')
  })

  it('hides the value when displayValue is false', () => {
    const subject = testbed.render({
      displayValue: false
    })
    expect(subject.find('output').length).to.equal(0)
  })

  describe('for a11y', function () {
    it('should meet standards', function (done) {
      const subject = testbed.render({
        defaultValue: 50
      })

      subject.should.be.accessible(done)
    })

    it('sets the input role to "slider"', function () {
      const subject = testbed.render({
        defaultValue: 50
      })

      expect(subject.find('input').getAttribute('role'))
        .to.equal('slider')
    })

    it('sets the aria-valuenow attribute', function () {
      const subject = testbed.render({
        defaultValue: 40
      })

      expect(subject.find('input').getAttribute('aria-valuenow'))
        .to.equal('40')
    })

    it('sets the aria-valuemin attribute', function () {
      const subject = testbed.render({
        min: 20
      })

      expect(subject.find('input').getAttribute('aria-valuemin'))
        .to.equal('20')
    })

    it('sets the aria-valuemax attribute', function () {
      const subject = testbed.render({
        max: 80
      })

      expect(subject.find('input').getAttribute('aria-valuemax'))
        .to.equal('80')
    })

    it('formats the aria-valuetext attribute', function () {
      const subject = testbed.render({
        defaultValue: 40,
        formatValue: function (value) {
          return value + '%'
        }
      })

      expect(subject.find('input').getAttribute('aria-valuetext'))
        .to.equal('40%')
    })
  })

  describe('when the input value changes', function () {
    it('should update the value displayed', function () {
      const subject = testbed.render({
        defaultValue: 50
      })

      const input = subject.find('input')

      setValue(input, 30)

      expect(subject.find('output').text())
        .to.equal('30')
      expect(input.getAttribute('aria-valuenow'))
        .to.equal('30')
    })

    it('should call the onChange prop', function () {
      const onChange = testbed.sandbox.stub()

      const subject = testbed.render({
        defaultValue: 50,
        onChange
      })

      setValue(subject.find('input'), 30)

      expect(onChange).to.have.been.calledWith('30')
    })

    it('should not update the input value when the value prop is set', function () {
      const subject = testbed.render({
        value: 0
      })

      setValue(subject.find('input'), 30)

      expect(subject.prop('value')).to.equal(0)
    })
  })
})

/*
 Note: this normally wouldn't be required, but this component
 has a hack to workaround a react bug and browser inconsistencies
 in handling events with input[type="range"] so we have to fire native
 events instead of using the React test utilities to simulate them
*/
function setValue (input, value) {
  input.getDOMNode().value = value // eslint-disable-line no-param-reassign

  /* workaround for https://github.com/facebook/react/issues/554 */
  input.dispatchNativeEvent('change')
  input.dispatchNativeEvent('input')
}
