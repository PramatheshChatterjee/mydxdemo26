import { ThemeMachine, themeDefinition } from '@pega/cosmos-react-core';
import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

// Extend the definition without mutating Cosmos defaults. Inherited tokens follow
// application-level theme changes. Base tokens are the stable customization surface.
export const expandableCardThemeDefinition = {
  ...themeDefinition,
  components: {
    ...themeDefinition.components,
    'expandable-card': {
      gap: { $type: 'inherited', $value: 'base.spacing' },
      'font-size': { $type: 'inherited', $value: 'base.font-size' },
      'header-font-size': { $type: 'literal', $value: '1.5em' },
      'subheader-font-size': { $type: 'inherited', $value: 'base.font-size' },
      'subheader-icon-size': { $type: 'literal', $value: '1.25em' },
      'focus-shadow': { $type: 'inherited', $value: 'base.shadow.focus' },
      'border-radius': { $type: 'inherited', $value: 'base.border-radius' },
      'background-color': { $type: 'inherited', $value: 'base.palette.primary-background' },
      'foreground-color': { $type: 'inherited', $value: 'base.palette.foreground-color' },
      'border-color': { $type: 'inherited', $value: 'base.palette.border-line' }
    }
  }
};

export function useCardTheme(cosmosTheme: DefaultTheme) {
  // ThemeMachine resolves inherited token references. Memoization also keeps the
  // Material UI theme stable when only the card's expanded state changes.
  return useMemo(() => {
    const { theme } = new ThemeMachine<typeof expandableCardThemeDefinition>({
      definition: expandableCardThemeDefinition,
      theme: cosmosTheme
    });
    const tokens = theme.components['expandable-card'];
    return {
      tokens,
      // Material UI has a separate theme context; bridge the relevant Cosmos values
      // so its typography uses the same font and foreground as the styled wrapper.
      muiTheme: createTheme({
        typography: {
          fontFamily: theme.base['font-family'],
          body2: {
            fontSize: tokens['font-size'],
            fontWeight: theme.base['font-weight'].normal,
            lineHeight: theme.base['line-height'],
            letterSpacing: theme.base['letter-spacing']
          },
          h6: {
            fontSize: tokens['header-font-size'],
            fontWeight: theme.base['font-weight']['semi-bold'],
            lineHeight: theme.base['line-height'],
            letterSpacing: theme.base['letter-spacing']
          }
        },
        palette: { text: { primary: tokens['foreground-color'] } },
        components: {
          MuiTypography: { defaultProps: { color: 'inherit' } }
        }
      })
    };
  }, [cosmosTheme]);
}

type CardStyleTokens = ReturnType<typeof useCardTheme>['tokens'];

// The caller passes the object returned by Cosmos useTheme explicitly. The transient
// $tokens prop supplies the resolved card extension without adding attributes to the DOM.
const StyledExpandableCardWrapper = styled.div<{ $tokens: CardStyleTokens }>(
  ({ theme, $tokens }) => css`
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    border: 0.0625rem solid ${$tokens['border-color']};
    border-radius: ${$tokens['border-radius']};
    background-color: ${$tokens['background-color']};
    color: ${$tokens['foreground-color']};
    font-family: ${theme.base['font-family']};
    font-size: ${$tokens['font-size']};

    .expandable-card-subheader {
      --icon-badge-font-size: ${$tokens['subheader-font-size']};
      --icon-badge-icon-size: ${$tokens['subheader-icon-size']};
      font-size: ${$tokens['subheader-font-size']};
    }
  `
);

export default StyledExpandableCardWrapper;
