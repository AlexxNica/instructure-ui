import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import themeable from '@instructure/ui-themeable'
import findDOMNode from '@instructure/ui-utils/lib/dom/findDOMNode'

import styles from './styles.css'
import theme from './theme'

@themeable(theme, styles)
export default class Tab extends Component {
  /* eslint-disable react/require-default-props */
  static propTypes = {
    variant: PropTypes.oneOf(['simple', 'accordion', 'minimal', 'screenreader-only']),
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    controls: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    focus: PropTypes.bool,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    role: PropTypes.string,
    children: PropTypes.node
  }
  /* eslint-enable react/require-default-props */

  static defaultProps = {
    variant: 'simple',
    disabled: false,
    selected: false,
    focus: false,
    role: 'tab',
    onClick: function () {},
    onKeyDown: function () {}
  }

  handleClick = e => {
    if (this.props.disabled) {
      return
    }

    this.props.onClick(this.props.index, e)
  }

  handleKeyDown = e => {
    if (this.props.disabled) {
      return
    }

    this.props.onKeyDown(this.props.index, e)
  }

  syncNodeAttributes (node, props) {
    if (props.selected) {
      node.setAttribute('tabindex', 0)
      if (props.focus) {
        node.focus()
      }
    } else if (!props.disabled) {
      node.setAttribute('tabindex', -1)
    } else {
      node.removeAttribute('tabindex')
    }
  }

  componentDidMount () {
    this.syncNodeAttributes(findDOMNode(this), this.props)
  }

  componentDidUpdate () {
    this.syncNodeAttributes(findDOMNode(this), this.props)
  }

  renderIcon () {
    return <span className={styles.icon} aria-hidden="true" aria-label="" />
  }

  render () {
    const classes = {
      [styles.root]: true,
      [styles[this.props.variant]]: true
    }
    const icon = this.props.variant !== 'screenreader-only' && this.renderIcon()
    /* eslint-disable jsx-a11y/onclick-has-focus, jsx-a11y/no-static-element-interactions */
    return (
      <div
        className={classnames(classes)}
        role={this.props.role}
        id={this.props.id}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        aria-selected={this.props.selected ? 'true' : null}
        aria-disabled={this.props.disabled ? 'true' : null}
        aria-hidden={this.props.role === 'presentation' ? 'true' : null}
        aria-controls={this.props.controls}
      >
        {icon}
        {this.props.children}
      </div>
    )
    /* eslint-enable jsx-a11y/onclick-has-focus, jsx-a11y/no-static-element-interactions */
  }
}
