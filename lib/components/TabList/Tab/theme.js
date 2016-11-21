import { darken } from '../../../util/color'

export default function generator ({ colors, typography, spacing }) {
  return {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    lineHeight: typography.lineHeightCondensed,
    fontSize: typography.fontSizeMedium,

    accordionPadding: `${spacing.xSmall} ${spacing.small}`,
    accordionColor: colors.dark,
    accordionBackground: colors.light,
    accordionBorderColor: colors.border,
    accordionHoverBackground: darken(colors.light, 10),
    accordionSelectedBorderColor: colors.brand,
    accordionSelectedColor: colors.lightest,
    accordionSelectedBackground: colors.brand,
    accordionFocusedBorderColor: colors.lightest,

    simpleColor: colors.brand,
    simpleSelectedBackground: colors.lightest,
    simpleSelectedBorderColor: colors.border,
    simpleSelectedColor: colors.dark,

    minimalColor: colors.dark,
    minimalHoverBorderColor: colors.border,
    minimalSelectedBorderColor: colors.brand
  }
}

generator.canvas = function (variables) {
  return {
    accordionColor: variables['ic-brand-font-color-dark'],
    accordionSelectedBackground: variables['ic-brand-primary'],

    simpleColor: variables['ic-brand-primary'],
    simpleSelectedColor: variables['ic-brand-font-color-dark'],

    minimalColor: variables['ic-brand-font-color-dark'],
    minimalSelectedBorderColor: variables['ic-brand-primary']
  }
}
