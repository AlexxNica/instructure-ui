export default function ({ colors, typography, spacing, borders, stacking }) {
  const colorCheckerboard = '#eee'
  const colorCheckerboardInverse = '#444'

  return {
    padding: spacing.small,
    borderRadius: borders.radiusMedium,
    backgroundColor: colors.white,
    border: `${borders.widthSmall} solid #eee`,
    backgroundColorInverse: '#333',
    gradientCheckerboardSize: '1rem',
    gradientCheckerboard: `
      45deg,
      ${colorCheckerboard} 25%,
      transparent 25%,
      transparent 75%,
      ${colorCheckerboard} 75%,
      ${colorCheckerboard}`,
    gradientCheckerboardInverse: `
      45deg,
      ${colorCheckerboardInverse} 25%,
      transparent 25%,
      transparent 75%,
      ${colorCheckerboardInverse} 75%,
      ${colorCheckerboardInverse}`,
    fontFamilyError: 'Menlo, Consolas, Monaco, "Andale Mono", monospace',
    fontSizeError: typography.fontSizeSmall,
    backgroundError: colors.crimson,
    colorError: colors.white,
    toolbarColor: colors.white,
    toolbarBackground: '#008ee2'
  }
}
