import React, { Component, PropTypes } from 'react'
import Table from 'instructure-ui/lib/components/Table'
import ColorSwatch from '../ColorSwatch'
import CodeEditor from '../CodeEditor'

import styles from './styles.css'

export default class ThemeDoc extends Component {
  static propTypes = {
    a11y: PropTypes.bool,
    themeKey: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired
  }

  renderVariable (name, value) {
    return (
      <tr key={name}>
        <td>
          <code>{name}</code>
        </td>
        <td>
          <ColorSwatch color={value} />
          <code>{value}</code>
        </td>
      </tr>
    )
  }

  renderRows (section) {
    const rows = []

    for (const name in section) {
      const value = section[name]
      rows.push(this.renderVariable(name, value))
    }

    return rows
  }

  renderSection (name, content) {
    return (
      <div className={styles.section} key={name}>
        <Table caption={<h3>{name}</h3>}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </Table>
      </div>
    )
  }

  render () {
    const sections = []
    const variables = []

    const { theme, themeKey } = this.props

    for (const name in theme) {
      const value = theme[name]
      if (typeof value === 'object') {
        sections.push(this.renderSection(name, this.renderRows(value)))
      } else {
        variables.push(this.renderVariable(name, value))
      }
    }

    const key = this.props.a11y ? `${themeKey}-a11y` : themeKey

    const code = `
import 'instructure-ui/lib/themes/${themeKey}'
import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme'

ApplyTheme.setDefaultTheme('${key}')
`
    return (
      <div className={styles.root}>
        <h2 className={styles.heading}>
          {themeKey}
        </h2>
        <div className={styles.usage}>
          <CodeEditor readOnly code={code} mode="javascript" />
        </div>
        {sections}
        {variables.length > 0 && this.renderSection('brand variables', variables)}
      </div>
    )
  }
}
