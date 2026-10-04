import { ThemeMachine, themeDefinition } from '@pega/cosmos-react-core';
import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

// Extend the definition without mutating Cosmos defaults. Inherited tokens follow
// application-level theme changes, while the card adds its own spacing and avatar size.
export const expandableCardThemeDefinition = {
  ...themeDefinition,
  components: {
    ...themeDefinition.components,
    'expandable-card': {
      padding: { $type: 'literal', $value: '1.25rem' },
      'avatar-size': { $type: 'literal', $value: '3rem' },
      gap: { $type: 'inherited', $value: 'base.spacing' },
      'border-radius': { $type: 'inherited', $value: 'base.border-radius' },
      'background-color': { $type: 'inherited', $value: 'base.palette.primary-background' },
      'foreground-color': { $type: 'inherited', $value: 'base.palette.foreground-color' },
      'border-color': { $type: 'inherited', $value: 'base.colors.gray.light' }
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
        typography: { fontFamily: theme.base['font-family'] },
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
    border: 1px solid ${$tokens['border-color']};
    border-radius: ${$tokens['border-radius']};
    background-color: ${$tokens['background-color']};
    color: ${$tokens['foreground-color']};
    font-family: ${theme.base['font-family']};
  `
);

export default StyledExpandableCardWrapper;
