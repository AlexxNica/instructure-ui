import React, {Component, PropTypes} from 'react'
import parseDescription from '../../util/parse-description'

import ComponentPlayground from '../ComponentPlayground'

export default class ComponentDescription extends Component {
  static propTypes = {
    themeKey: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }

  componentWillUpdate (nextProps) {
    if (nextProps.description !== this.props.description) {
      this.sections = parseDescription(nextProps.description)
    }
  }

  renderDescription () {
    return this.sections.map((section, i) => {
      switch (section.type) {
        case 'code':
          return (
            <ComponentPlayground
              name={this.props.name}
              code={section.content}
              themeKey={this.props.themeKey}
              variant={section.variant}
              language={section.language}
              key={i} />
          )
        case 'html':
          return (
            <div dangerouslySetInnerHTML={{__html: section.content}} key={i} />
          )
      }
    })
  }

  render () {
    if (!this.sections) {
      this.sections = parseDescription(this.props.description)
    }
    return (
      <div>
        {this.renderDescription()}
      </div>
    )
  }
}
