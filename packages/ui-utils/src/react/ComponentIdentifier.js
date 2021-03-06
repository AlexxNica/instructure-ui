import React, { Component } from 'react'
import PropTypes from 'prop-types'
import matchComponentTypes from './matchComponentTypes'
import ensureSingleChild from './ensureSingleChild'

/**
 * Abstract component identifier. Helpful for picking out a specific child.
 *
 * Example:
 *
 *  class App extends Component {
 *    render () {
 *      const title = pick(Title, this.props.children)
 *      const content = pick(Content, this.props.children)
 *
 *      return (
 *        <div>
 *          {title}
 *          <ContextBox>
 *            {content}
 *          </ContextBox>
 *        </div>
 *      )
 *    }
 *  }
 *
 *  class Title extends ComponentIdentifier { static displayName = "Title" }
 *  class Content extends ComponentIdentifier { static displayName = "Content" }
 *
 *  ReactDOM.render(
 *    <App>
 *      <Title><h2>Hello World!</h2></Title>
 *      <Content><div>This text gets decorated within `App`.</div></Content>
 *    </App>,
 *    document.getElementById('container')
 *  )
 */
export default class ComponentIdentifier extends Component {
  /* eslint-disable react/require-default-props */
  static propTypes = {
    /**
     * The children to be rendered
     */
    children: PropTypes.node
  }
  /* eslint-enable react/require-default-props */

  render () {
    const {
      children,
      ...props
    } = this.props

    return ensureSingleChild(children, props)
  }
}

/**
 * Pick a specific child component from a component's children
 *
 * @param {Component} component The component to look for
 * @param {Array} children The child components to look through
 * @return {Component} The matching component if found, otherwise undefined
 */
export function pick (component, children) {
  let result

  React.Children.forEach(children, (child) => {
    if (matchComponentTypes(child, [component])) {
      result = child
    }
  })

  return result
}
