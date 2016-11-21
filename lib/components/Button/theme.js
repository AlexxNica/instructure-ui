import { alpha, darken } from '../../util/color'

const activeShadow = 'inset 0 1px 0'
const focusShadow = 'inset 0 0 0 1px'
const focusOutline = '1px solid'

const buttonVariant = function (style, mainColor, textColor) {
  return {
    [`${style}Background`]: mainColor,
    [`${style}BorderColor`]: darken(mainColor, 10),
    [`${style}Color`]: textColor,
    [`${style}HoverBackground`]: darken(mainColor, 10),
    [`${style}ActiveBoxShadow`]: `${activeShadow} ${darken(mainColor, 35)}`
  }
}

export default function generator ({ colors, borders, forms, spacing, typography }) {
  return {
    borderWidth: borders.widthSmall,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    borderRadius: borders.radiusMedium,
    borderStyle: borders.style,

    smallHeight: forms.inputHeightSmall,
    smallPadding: `0 ${spacing.xSmall}`,
    smallFontSize: typography.fontSizeXSmall,

    mediumHeight: forms.inputHeightMedium,
    mediumPadding: `0 ${spacing.small}`,
    mediumFontSize: typography.fontSizeSmall,

    largeHeight: forms.inputHeightLarge,
    largePadding: `0 ${spacing.medium}`,
    largeFontSize: typography.fontSizeMedium,

    focusBorderRadius: borders.radiusLarge,
    focusBorder: `${focusOutline} ${colors.brand}`,

    lightBackground: colors.lightest,
    lightBorderColor: darken(colors.light, 10),
    lightColor: colors.dark,
    lightHoverBackground: darken(colors.lightest, 5),
    lightActiveBoxShadow: `${activeShadow} ${darken(colors.lightest, 25)}`,

    ghostBackground: 'transparent',
    ghostBorderColor: colors.brand,
    ghostColor: colors.brand,
    ghostHoverBackground: alpha(colors.brand, 10),
    ghostActiveBoxShadow: `inset 0 3px 0 ${alpha(colors.brand, 20)}`,

    ghostInverseBackground: 'transparent',
    ghostInverseBorderColor: colors.lightest,
    ghostInverseColor: colors.lightest,
    ghostInverseHoverBackground: alpha(colors.lightest, 10),
    ghostInverseActiveBoxShadow: `inset 0 3px 0 ${alpha(colors.lightest, 20)}`,
    ghostInverseFocusBorder: `${focusOutline} ${colors.lightest}`,

    linkColor: colors.brand,
    linkBorderColor: 'transparent',
    linkHoverColor: darken(colors.brand, 10),
    linkFocusBoxShadow: colors.brand,

    iconBorderColor: 'transparent',
    iconPadding: `0 ${spacing.xSmall}`,
    iconColor: colors.dark,
    iconHoverColor: colors.brand,
    iconFocusBoxShadow: `${focusShadow} ${colors.brand}`,

    iconInverseColor: colors.lightest,
    iconInverseHoverColor: colors.lightest,
    iconInverseFocusBoxShadow: `${focusShadow} ${colors.lightest}`,

    ...buttonVariant(
      'default',
      colors.light,
      colors.dark
    ),

    ...buttonVariant(
      'primary',
      colors.brand,
      colors.lightest
    ),

    ...buttonVariant(
      'success',
      colors.success,
      colors.lightest
    ),

    ...buttonVariant(
      'circlePrimary',
      colors.brand,
      colors.lightest
    ),

    ...buttonVariant(
      'circleDanger',
      colors.danger,
      colors.lightest
    )
  }
}

generator.canvas = function (variables) {
  return {
    focusBorder: `${focusOutline} ${variables['ic-brand-primary']}`,

    ghostBorderColor: variables['ic-brand-button--primary-bgd'],
    ghostColor: variables['ic-brand-button--primary-bgd'],
    ghostHoverackground: alpha(variables['ic-brand-button--primary-bgd'], 10),
    ghostActiveBoxShadow: `inset 0 3px 0 ${alpha(variables['ic-brand-button--primary-bgd'], 20)}`,

    linkColor: variables['ic-link-color'],
    linkHoverColor: darken(variables['ic-link-color'], 10),
    linkFocusBoxShadow: variables['ic-link-color'],

    iconHoverColor: variables['ic-brand-primary'],
    iconFocusBoxShadow: `${focusShadow} ${variables['ic-brand-primary']}`,

    ...buttonVariant(
      'primary',
      variables['ic-brand-button--primary-bgd'],
      variables['ic-brand-button--primary-text']
    ),

    ...buttonVariant(
      'circle-primary',
      variables['ic-brand-button--primary-bgd'],
      variables['ic-brand-button--primary-text']
    )
  }
}
