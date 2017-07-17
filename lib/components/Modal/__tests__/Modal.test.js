import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../Button'
import Portal from '../../Portal'
import Modal, {ModalHeader, ModalBody, ModalFooter} from '../index'

describe('<Modal />', function () {
  const testbed = new Testbed(
    <Modal transition="fade" label="Modal Dialog" closeButtonLabel="Close">
      <ModalBody />
    </Modal>
  )

  it('should render nothing and have a node with no parent when closed', function () {
    const subject = testbed.render()
    const node = subject.find(Portal).unwrap().node
    expect(node).to.equal(undefined)
  })

  it('should render children and have a node with a parent when open', function () {
    const subject = testbed.render({
      isOpen: true
    })
    const portal = subject.find(Portal).unwrap()
    expect(portal.node.parentNode).to.equal(document.body)
  })

  it('should render an "icon" style close button by default', () => {
    const subject = testbed.render({isOpen: true})
    const closeButton = subject.ref('_content').find(Button)
    expect(closeButton.prop('variant')).to.equal('icon')
  })

  it('should support closeButtonVariant prop', () => {
    const subject = testbed.render({
      isOpen: true,
      closeButtonVariant: 'icon-inverse'
    })
    const closeButton = subject.ref('_content').find(Button)
    expect(closeButton.prop('variant')).to.equal('icon-inverse')
  })

  it('should use transition', function () {
    const onEnter = testbed.stub()
    const onEntering = testbed.stub()
    const onEntered = testbed.stub()

    testbed.render({
      isOpen: true,
      transition: 'fade',
      onEnter,
      onEntering,
      onEntered
    })

    testbed.tick()

    expect(onEnter).to.have.been.called

    testbed.tick()

    expect(onEntering).to.have.been.called
    expect(onEntered).to.have.been.called
  })

  it('should support onReady prop', function () {
    const onReady = testbed.stub()
    testbed.render({
      isOpen: true,
      onReady
    })

    testbed.tick()

    expect(onReady).to.have.been.called
  })

  it('should support onClose prop', function (done) {
    const onClose = testbed.stub()
    const subject = testbed.render({
      onClose,
      isOpen: true
    })

    expect(onClose).to.not.have.been.called

    subject.setProps({ isOpen: false }, () => {
      testbed.tick() // exiting -> exited

      testbed.defer(() => { // wait for re-render after state change
        expect(onClose).to.have.been.called
        done()
      })
    })
  })

  it('should not request close when overlay clicked by default', function () {
    const onRequestClose = testbed.stub()
    const subject = testbed.render({
      isOpen: true,
      onRequestClose
    })

    subject.ref('_overlay').simulate('click')

    expect(onRequestClose).to.not.have.been.called
  })

  it('should request close when overlay clicked with prop', function () {
    const onRequestClose = testbed.stub()
    const subject = testbed.render({
      isOpen: true,
      shouldCloseOnOverlayClick: true,
      onRequestClose
    })

    subject.ref('_overlay').simulate('click')

    expect(onRequestClose).to.have.been.called
  })

  it('should request close when close button is clicked', function () {
    const onRequestClose = testbed.stub()
    const subject = testbed.render({
      isOpen: true,
      onRequestClose
    })

    subject.ref('_content').find(Button).simulate('click')

    expect(onRequestClose).to.have.been.called
  })

  it('should render children', function () {
    const subject = testbed.render({
      isOpen: true,
      children: <ModalBody><Button>Cancel</Button></ModalBody>
    })

    // + 1 for x-icon button
    expect(subject.ref('_content').find(Button).length)
      .to.equal(2)
  })

  describe('children validation', function () {
    it('should pass validation when children are valid', function () {
      function render () {
        testbed.render({
          isOpen: true,
          children: [
            <ModalHeader key="header">Hello World</ModalHeader>,
            <ModalBody key="body">Foo Bar Baz</ModalBody>,
            <ModalFooter key="footer"><Button>Cancel</Button></ModalFooter>
          ]
        })
      }

      expect(render).to.not.throw(Error)
    })

    it('should not pass validation when children are invalid', function () {
      function render () {
        testbed.render({
          isOpen: true,
          children: [
            <ModalBody key="body">Foo Bar Baz</ModalBody>,
            <ModalFooter key="footer"><Button>Cancel</Button></ModalFooter>,
            <ModalHeader key="header">Hello World</ModalHeader>
          ]
        })
      }

      expect(render).to.throw(Error)
    })
  })
})

describe('<Modal /> managed focus', function () {
  class ModalExample extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        isOpen: false
      }
    }

    static propTypes = {
      onRequestClose: PropTypes.func,
      getDefaultFocusElement: PropTypes.func
    }

    handleToggleOpen = () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }

    handleRequestClose = () => {
      if (this.props.onRequestClose) {
        this.props.onRequestClose()
      }
      this.handleToggleOpen()
    }

    render () {
      const closeButtonRef = (c) => {
        this._closeButton = c
      }

      const contentRef = (c) => {
        this._content = c
      }

      return (
        <div>
          <input type="text" />
          <button onClick={this.handleToggleOpen}>Toggle Modal</button>
          <Modal
            isOpen={this.state.isOpen}
            onRequestClose={this.handleRequestClose}
            getDefaultFocusElement={this.props.getDefaultFocusElement}
            label="A Modal"
            closeButtonRef={closeButtonRef}
            contentRef={contentRef}
          >
            <ModalBody>
              <div>
                <input type="text" id="input-one" />
                <input type="text" id="input-two" />
              </div>
            </ModalBody>
          </Modal>
        </div>
      )
    }
  }

  const testbed = new Testbed(<ModalExample />)

  it('should focus closeButton by default', function () {
    const subject = testbed.render()

    const button = subject.find('button')

    button.simulate('click')

    testbed.tick() // enter

    testbed.tick() // entered

    expect(subject.ref('_closeButton').focused()).to.be.true
  })

  it('should take a prop for finding default focus', function () {
    const subject = testbed.render({ getDefaultFocusElement: function () {
      return document.getElementById('input-one')
    }})
    const button = subject.find('button')

    button.simulate('click')

    testbed.tick() // enter

    testbed.tick() // entered

    expect(document.getElementById('input-one') === document.activeElement).to.be.true
  })

  it('should request close when Esc key pressed', function () {
    const onRequestClose = testbed.stub()
    const subject = testbed.render({
      isOpen: true,
      onRequestClose
    })

    const button = subject.find('button')

    button.simulate('click')

    testbed.tick() // transition

    subject.ref('_content').keyDown('esc')

    expect(onRequestClose).to.have.been.called
  })
})
