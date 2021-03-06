import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import themeable from '@instructure/ui-themeable'
import CustomPropTypes from '@instructure/ui-utils/lib/react/CustomPropTypes'
import getElementType from '@instructure/ui-utils/lib/react/getElementType'
import { omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'

import styles from './styles.css'
import theme from './theme'

/**
  A Typography component for styling text content

  ### Font sizes

  ```jsx_example
  <div>
    <Typography size="x-small">I'm extra small</Typography><br/>
    <Typography size="small">I'm small</Typography><br/>
    <Typography>I'm medium</Typography><br/>
    <Typography size="large">I'm large</Typography><br/>
    <Typography size="x-large">I'm extra large</Typography><br/>
    <Typography size="xx-large">I'm extra extra large</Typography>
  </div>
  ```

  ### Font weights

  ```jsx_example
  <div>
    <Typography weight="light">I'm light text</Typography><br/>
    <Typography>I'm normal text</Typography><br/>
    <Typography weight="bold">I'm bold text</Typography>
  </div>
  ```

  ### Font styles

  ```jsx_example
  <div>
    <Typography fontStyle="italic">I'm italic text</Typography><br/>
    <Typography>I'm normal text</Typography>
  </div>
  ```

  ### Line heights

  ```jsx_example
  <div>
    <Typography lineHeight="fit">
      <p>{lorem.paragraph()}</p>
    </Typography>
    <Typography>
      <p>{lorem.paragraph()}</p>
    </Typography>
    <Typography lineHeight="condensed">
      <p>{lorem.paragraph()}</p>
    </Typography>
    <Typography lineHeight="double">
      <p>{lorem.paragraph()}</p>
    </Typography>
  </div>
  ```

  ### Text transform

  ```jsx_example
  <div>
    <Typography transform="capitalize">I'm capitalized text</Typography><br/>
    <Typography transform="uppercase">I'm uppercase text</Typography><br/>
    <Typography transform="lowercase">I'M LOWERCASE TEXT</Typography><br/>
  </div>
  ```

  ### Letter-spacing

  ```jsx_example
  <div>
    <Typography letterSpacing="normal">I'm normal text</Typography><br/>
    <Typography letterSpacing="condensed">I'm condensed text</Typography><br/>
    <Typography letterSpacing="expanded" transform="uppercase">I'm expanded uppercase text</Typography><br/>
  </div>
  ```
  ### Text colors

  ```jsx_example
  <div>
    <Typography color="primary">I'm primary text</Typography><br/>
    <Typography color="secondary">I'm secondary text</Typography><br/>
    <Typography color="brand">I'm brand text</Typography><br />
    <Typography color="success">I'm success text</Typography><br/>
    <Typography color="warning">I'm warning text</Typography><br/>
    <Typography color="error">I'm error text</Typography>
  </div>
  ```

  ```jsx_example_inverse
  <div>
    <Typography color="primary-inverse">I'm primary text</Typography><br/>
    <Typography color="secondary-inverse">I'm secondary text</Typography>
  </div>
  ```

  ### Element styles

  ```jsx_example
    <Typography>
      <b>bold </b>
      <strong>strong </strong>
      <i>italic </i>
      <em>emphasis </em>
      <pre>preformatted</pre>
      <code>code</code>
      This<sup>is</sup> some<sub>text</sub>.
    </Typography>
  ```

**/
@themeable(theme, styles)
export default class Typography extends Component {
  /* eslint-disable react/require-default-props */
  static propTypes = {
    /**
    * the element type to render as
    */
    as: CustomPropTypes.elementType,
    weight: PropTypes.oneOf([
      'normal',
      'light',
      'bold'
    ]),
    fontStyle: PropTypes.oneOf([
      'italic',
      'normal'
    ]),
    size: PropTypes.oneOf([
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large'
    ]),
    lineHeight: PropTypes.oneOf([
      'default',
      'fit',
      'condensed',
      'double'
    ]),
    letterSpacing: PropTypes.oneOf([
      'normal',
      'condensed',
      'expanded'
    ]),
    transform: PropTypes.oneOf([
      'none',
      'capitalize',
      'uppercase',
      'lowercase'
    ]),
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'primary-inverse',
      'secondary-inverse',
      'success',
      'error',
      'warning',
      'brand'
    ]),
    children: PropTypes.node
  }
  /* eslint-enable react/require-default-props */

  static defaultProps = {
    as: 'span',
    size: 'medium',
    letterSpacing: 'normal'
  }

  render () {
    const {
      weight,
      fontStyle,
      size,
      lineHeight,
      letterSpacing,
      transform,
      color
    } = this.props

    const classes = {
      [styles.root]: true,
      [styles[size]]: size,
      [styles[`weight-${weight}`]]: weight,
      [styles[`style-${fontStyle}`]]: fontStyle,
      [styles[`transform-${transform}`]]: transform,
      [styles[`lineHeight-${lineHeight}`]]: lineHeight,
      [styles[`letterSpacing-${letterSpacing}`]]: letterSpacing,
      [styles[`color-${color}`]]: color
    }

    const props = {
      ...omitProps(this.props, Typography.propTypes),
      className: classnames(classes)
    }

    const ElementType = getElementType(Typography, this.props)

    return <ElementType {...props}>{this.props.children}</ElementType>
  }
}
