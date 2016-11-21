import { darken } from '../../util/color'

export default function generator ({ colors, typography, spacing }) {
  return {
    color: colors.dark,
    background: colors.lightest,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    fontSize: typography.fontSizeMedium,
    borderColor: colors.border,

    headerBorderColor: darken(colors.border, 20),

    hoverBorderColor: colors.brand,

    captionColor: colors.dark,
    captionFontSize: typography.fontSizeMedium,

    smallFontSize: typography.fontSizeXSmall,
    smallLineHeight: typography.lineHeightFit,
    smallPadding: `${spacing.xxSmall} ${spacing.xSmall}`,

    mediumFontSize: typography.fontSizeSmall,
    mediumLineHeight: typography.lineHeightCondensed,
    mediumPadding: `${spacing.xSmall} ${spacing.small}`,

    largeFontSize: typography.fontSizeMedium,
    largeLineHeight: typography.lineHeightCondensed,
    largePadding: `${spacing.small} ${spacing.medium}`,

    stripedBackground: colors.light
  }
}

generator.canvas = function (variables) {
  return {
    color: variables['ic-brand-font-color-dark'],
    hoverBorderColor: variables['ic-brand-primary']
  }
}
