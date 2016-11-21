import { alpha } from '../../util/color'

export default function generator ({ colors, borders, typography, forms, spacing }) {
  return {
    borderColor: colors.border,
    borderWidth: borders.widthSmall,
    borderStyle: borders.style,
    borderRadius: borders.radiusMedium,

    background: colors.lightest,
    color: colors.dark,

    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    fontSize: typography.fontSizeSmall,

    padding: spacing.small,

    arrowColor: colors.dark,

    smallHeight: forms.inputHeightSmall,
    smallFontSize: typography.fontSizeXSmall,
    smallArrowWidth: '0.75rem',

    mediumHeight: forms.inputHeightMedium,
    mediumFontSize: typography.fontSizeSmall,
    mediumArrowWidth: '0.875rem',

    largeHeight: forms.inputHeightLarge,
    largeFontSize: typography.fontSizeMedium,
    largeArrowWidth: '1rem',

    focusBorderColor: colors.brand,
    focusOutlineColor: alpha(colors.brand, 50),

    errorBorderColor: colors.danger,
    errorOutlineColor: alpha(colors.danger, 50)
  }
}

generator.canvas = function (variables) {
  return {
    color: variables['ic-brand-font-color-dark'],
    focusBorderColor: variables['ic-brand-primary'],
    focusOutlineColor: alpha(variables['ic-brand-primary'], 50)
  }
}
