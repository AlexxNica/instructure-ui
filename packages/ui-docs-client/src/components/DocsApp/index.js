import React, { Component } from 'react'

import themeable from '@instructure/ui-themeable'

import ScreenReaderContent from '@instructure/ui-core/lib/components/ScreenReaderContent'
import Select from '@instructure/ui-core/lib/components/Select'
import Tray from '@instructure/ui-core/lib/components/Tray'

import { getRegisteredThemes } from '@instructure/ui-themeable/lib/registry'

import IconHeartSolid from 'instructure-icons/lib/Solid/IconHeartSolid'
import IconGithubSolid from 'instructure-icons/lib/Solid/IconGithubSolid'

import classnames from 'classnames'
import ComponentDoc from '../ComponentDoc'
import DocsHeader from '../DocsHeader'
import DocsNav from '../DocsNav'
import HtmlDoc from '../HtmlDoc'
import ThemeDoc from '../ThemeDoc'
import DocsSection from '../DocsSection'

import Button from '../Button'

import styles from './styles.css'
import theme from './theme'

import * as propTypes from './propTypes'

const themes = getRegisteredThemes()

@themeable(theme, styles)
export default class DocsApp extends Component {
  static propTypes = {
    componentsMap: propTypes.componentMap.isRequired,
    categorizedComponents: propTypes.componentsByCategory.isRequired,
    documentsMap: propTypes.docMap.isRequired,
    documentsList: propTypes.docList.isRequired,
    library: propTypes.library.isRequired
  }

  static childContextTypes = {
    library: propTypes.library
  }

  constructor (props) {
    super()
    this.state = {
      menuSearch: '',
      showMenu: false,
      themeKey: 'canvas'
    }
  }

  getChildContext () {
    return { library: this.props.library }
  }

  updateKey = () => {
    this.setState({
      key: window.location.hash.slice(1) || 'index'
    })
  }

  handleMenuToggle = () => {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  handleThemeChange = e => {
    this.setState({
      themeKey: e.target.value
    })
  }

  componentDidMount () {
    this.updateKey()

    window.addEventListener('hashchange', this.updateKey, false)
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.updateKey, false)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.key !== this.state.key) {
      this._content.scrollTop = 0
    }
  }

  renderThemeSelect () {
    const themeKeys = Object.keys(themes)
    return (
      <div className={styles.themeSelect}>
        <Select name="theme" label="Theme" onChange={this.handleThemeChange} value={this.state.themeKey}>
          {themeKeys.map(themeKey => {
            return (
              <option key={themeKey} value={themeKey}>
                {themeKey}
              </option>
            )
          })}
        </Select>
      </div>
    )
  }

  renderTheme (themeKey, theme) {
    return (
      <DocsSection id={themeKey}>
        <ThemeDoc themeKey={themeKey} theme={theme} />
      </DocsSection>
    )
  }

  renderComponent (component) {
    const themeKey = this.state.themeKey
    return (
      <DocsSection id={component.name}>
        <div className={styles.docsSectionHeader}>
          {this.renderThemeSelect()}
        </div>
        <ComponentDoc
          name={component.name}
          doc={component.doc}
          theme={component.generateTheme(themeKey)}
          accessible={themes[themeKey].accessible}
          themeKey={themeKey}
          path={component.path}
          library={this.props.library}
        />
      </DocsSection>
    )
  }

  renderDoc (doc) {
    const heading = ['Index', 'CHANGELOG'].indexOf(doc.title) === -1 ? doc.title : null
    return (
      <DocsSection id={doc.name} heading={heading}>
        <HtmlDoc html={doc.html} />
      </DocsSection>
    )
  }

  renderError (key) {
    return (
      <DocsSection id="error">
        <h2>Document not found</h2>
      </DocsSection>
    )
  }

  renderContent (key) {
    const component = this.props.componentsMap[key]
    const doc = this.props.documentsMap[key]
    const theme = themes[key]

    if (component) {
      return this.renderComponent(component)
    } else if (doc) {
      return this.renderDoc(doc)
    } else if (theme) {
      return this.renderTheme(key, themes[key])
    } else {
      return this.renderError(key)
    }
  }

  render () {
    const classes = {
      [styles.root]: true,
      [styles['show-menu']]: this.state.showMenu
    }
    return (
      <div className={classnames(classes)}>
        <div className={styles.container}>
          <div className={styles.menuToggle}>
            <Button
              onClick={this.handleMenuToggle}
              aria-controls="nav"
              aria-expanded={this.state.showMenu ? 'true' : 'false'}
            >
              <span className={styles.hamburger}>
                <span className={styles.line}>
                  <ScreenReaderContent>Toggle Navigation</ScreenReaderContent>
                </span>
              </span>
            </Button>
          </div>
          <div
            className={styles.content}
            ref={c => {
              this._content = c
            }}
          >
            <div className={styles.main} role="main" id="main">
              {this.renderContent(this.state.key)}

              <div className={styles.footer}>
                Made with &nbsp;
                <IconHeartSolid className={styles.footerIcon} />
                &nbsp; by {this.props.library.author}. &nbsp;
                <a href={this.props.library.repository} className={styles.githubLink} target="_blank">
                  <IconGithubSolid className={styles.footerIcon} />
                </a>
              </div>
            </div>
          </div>
          <Tray
            label="Navigation"
            open={this.state.showMenu}
            size="x-small"
            applicationElement={() => [document.getElementById('app'), document.getElementById('flash-messages')]}
          >
            <div className={styles.nav} id="nav">
              <DocsHeader />
              <DocsNav
                selected={this.state.key}
                components={this.props.categorizedComponents}
                documents={this.props.documentsList}
                themes={themes}
              />
            </div>
          </Tray>
        </div>
      </div>
    )
  }
}
