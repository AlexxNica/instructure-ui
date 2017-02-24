import React, { Component, PropTypes } from 'react'
import themeable from '../../util/themeable'
import classnames from 'classnames'
import ModalContent from './ModalContent'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import ModalFooter from './ModalFooter'

import createChainedFunction from '../../util/createChainedFunction'
import CustomPropTypes from '../../util/CustomPropTypes'
import focusManager from '../../util/focusManager'
import scopeTab from '../../util/scopeTab'
import { pickProps } from '../../util/passthroughProps'
import keycode from 'keycode'

import Overlay from '../Overlay'
import Transition from '../Transition'

import styles from './styles.css'
import theme from './theme.js'

/**
  A Modal component

  ```js_example
  const fpo = lorem.paragraphs(5)

  class Example extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        isModalOpen: false,
        modalSize: 'auto'
      }

      this._applicationContainer = document.getElementById('app')
    }

    handleModalReady = () => {
      this._applicationContainer.setAttribute('aria-hidden', 'true')
    };

    handleModalClose = () => {
      this._applicationContainer.removeAttribute('aria-hidden')
      this._modalTrigger.focus()
    };

    handleModalRequestClose = () => {
      this.setState({ isModalOpen: false })
    };

    handleButtonClick = () => {
      this.setState({
        isModalOpen: !this.state.isModalOpen
      })
    };

    handleSelectChange = (e) => {
      this.setState({
        modalSize: e.target.value
      })
    };

    render () {
      const variants = [
        {value: 'auto', label: 'Auto'},
        {value: 'small', label: 'Small'},
        {value: 'medium', label: 'Medium'},
        {value: 'large', label: 'Large'},
        {value: 'fullscreen', label: 'Full Screen'}
      ]

      return (
        <div style={{height: 750}}>
          <Select
            onChange={this.handleSelectChange}
            value={this.state.modalSize}
            label={<ScreenReaderContent>Modal size</ScreenReaderContent>}
            isBlock={false}
          >
            {variants.map((s) => <option value={s.value} key={s.value}>{s.label}</option>)}
          </Select>
          &nbsp;
          <Button onClick={this.handleButtonClick} ref={(c) => this._modalTrigger = c}>
            {this.state.isModalOpen ? 'Close' : 'Open'} the Modal
          </Button>
          <Modal
            isOpen={this.state.isModalOpen}
            shouldCloseOnOverlayClick={true}
            onReady={this.handleModalReady}
            onClose={this.handleModalClose}
            onRequestClose={this.handleModalRequestClose}
            transition="fade"
            size={this.state.modalSize}
            label="Modal Dialog: Hello World"
            closeButtonLabel="Close"
          >
            <ModalHeader>
              <Heading>Hello World</Heading>
            </ModalHeader>
            <ModalBody>
              <Typography lineHeight="double">{fpo}</Typography>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleButtonClick}>Close</Button>&nbsp;
              <Button onClick={this.handleButtonClick} variant="primary">Submit</Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    }
  }

  <Example />
  ```
**/
@themeable(theme, styles)
export default class Modal extends Component {
  static propTypes = {
    /**
     * Accessible label for the `<Modal />`
     */
    label: PropTypes.string.isRequired,
    /**
     * Whether or not the `<Modal />` is open
     */
    isOpen: PropTypes.bool,
    /**
     * Get the default element to focus when the `<Modal />` opens. Will be close button by default.
     */
    getDefaultFocusElement: PropTypes.func,
    /**
     * Whether or not the `<Modal />` should close when `<Overlay />` is clicked
     */
    shouldCloseOnOverlayClick: PropTypes.bool,
    /**
     * The type of `<Transition />` to use for animating `<Overlay />`.
     */
    transition: Transition.propTypes.type,
    /**
     * The children to be rendered within the `<Modal />`
     */
    children: CustomPropTypes.Children.enforceOrder(
      [ModalHeader, ModalBody, ModalFooter],
      [ModalHeader, ModalBody],
      [ModalBody, ModalFooter],
      [ModalBody]
    ),

    /**
     * The size of the `<Modal />`
     */
    size: PropTypes.oneOf(['auto', 'small', 'medium', 'large', 'fullscreen']),
    /**
     * Callback fired when `<Modal />` content has been rendered
     */
    onReady: PropTypes.func,
    /**
     * Callback fired when `<Modal />` has been closed
     */
    onClose: PropTypes.func,
    /**
     * Event triggered when the `<Modal />` is requesting to be closed
     */
    onRequestClose: PropTypes.func,
    /**
     * Callback fired when `<Modal />` has been opened
     */
    onAfterOpen: PropTypes.func,
    /**
     * Callback fired before the `<Modal />` transitions in
     */
    onEnter: PropTypes.func,
    /**
     * Callback fired as the `<Modal />` begins to transition in
     */
    onEntering: PropTypes.func,
    /**
     * Callback fired after the `<Modal />` finishes transitioning in
     */
    onEntered: PropTypes.func,
    /**
     * Callback fired right before the `<Modal />` transitions out
     */
    onExit: PropTypes.func,
    /**
     * Callback fired as the `<Modal />` begins to transition out
     */
    onExiting: PropTypes.func,
    /**
     * Callback fired after the `<Modal />` finishes transitioning out
     */
    onExited: PropTypes.func,
    /**
     *
     * A function that returns a reference to the content element
     */
    contentRef: PropTypes.func,
    /**
     *
     * A function that returns a reference to the close button element
     */
    closeButtonRef: PropTypes.func
  }

  static defaultProps = {
    isOpen: false,
    size: 'auto',
    transition: 'fade',
    contentRef: function (el) {},
    closeButtonRef: function (el) {}
  }

  static childContextTypes = {
    size: PropTypes.oneOf(['auto', 'small', 'medium', 'large', 'fullscreen'])
  }

  getChildContext () {
    return {
      size: this.props.size
    }
  }

  componentWillMount () {
    if (this.props.isOpen) {
      this.setFocusAfterRender(true)
      this.open()
    }
  }

  componentWillReceiveProps (nextProps) {
    // Focus only needs to be set once when the modal is being opened
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setFocusAfterRender(true)
      this.open()
    } else if (this.props.isOpen && !nextProps.isOpen) {
      this.close()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.isOpen && !prevProps.isOpen && this.props.onAfterOpen) {
      this.props.onAfterOpen()
    }
  }

  componentWillUnMount () {
    this.isUnMounted = true
  }

  setFocusAfterRender (focus) {
    this.focusAfterRender = focus
  }

  maybeFocusContent () {
    if (this.focusAfterRender && !this.isUnMounted) {
      this.focusContent()
      this.setFocusAfterRender(false)
    }
  }

  focusContent () {
    let el

    if (typeof this.props.getDefaultFocusElement === 'function') {
      el = this.props.getDefaultFocusElement()
    } else {
      el = this.getDefaultFocusElement()
    }

    if (el) {
      el.focus()
    }
  }

  open () {
    focusManager.setupScopedFocus(this._content)
    focusManager.markForFocusLater()
  }

  close () {
    focusManager.returnFocus()
    focusManager.teardownScopedFocus()
  }

  ownerHandlesClose () {
    return typeof this.props.onRequestClose === 'function'
  }

  requestClose (event) {
    if (this.ownerHandlesClose()) {
      this.props.onRequestClose(event)
    }
  }

  getDefaultFocusElement = () => {
    return this._closeButton
  }

  handleKeyDown = (event) => {
    if (event.keyCode === keycode.codes.tab) {
      scopeTab(this._content, event)
    }

    if (event.keyCode === keycode.codes.esc) {
      event.preventDefault()
      this.requestClose(event)
    }
  }

  handlePortalReady = () => {
    // Timeout is needed to ensure componentDidUpdate runs before
    // maybeFocusContent, which is needed to flag focusAfterRender
    window.setTimeout(() => {
      if (!this.isUnMounted) {
        this.maybeFocusContent()
      }
    }, 0)
  }

  render () {
    const props = pickProps(this.props, ModalContent.propTypes)
    const closeButtonRef = (c) => {
      this._closeButton = c
      this.props.closeButtonRef(c)
    }

    return (
      <Overlay
        isOpen={this.props.isOpen}
        transition={this.props.transition}
        shouldCloseOnClick={this.props.shouldCloseOnOverlayClick}
        onReady={createChainedFunction(
          this.handlePortalReady,
          this.props.onReady
        )}
        onClose={this.props.onClose}
        onRequestClose={this.props.onRequestClose}
        onEnter={this.props.onEnter}
        onEntering={this.props.onEntering}
        onEntered={this.props.onEntered}
        onExit={this.props.onExit}
        onExiting={this.props.onExiting}
        onExited={this.props.onExited}
        contentRef={(c) => { this._overlay = c }} // eslint-disable-line
      >
        <div
          className={classnames({
            [styles.layout]: true,
            [styles.fullscreen]: this.props.size === 'fullscreen'
          })}
          onKeyDown={this.handleKeyDown}
          ref={(c) => {
            this._content = c
            this.props.contentRef(c)
          }}
        >
          <ModalContent
            {...props}
            isDismissable
            onClose={this.props.onRequestClose}
            closeButtonRef={closeButtonRef}
          />
        </div>
      </Overlay>
    )
  }
}

export { default as ModalHeader } from './ModalHeader'
export { default as ModalBody } from './ModalBody'
export { default as ModalFooter } from './ModalFooter'
