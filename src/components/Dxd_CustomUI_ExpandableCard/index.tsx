import { useEffect, useId, useState } from 'react';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { useTheme, withConfiguration } from '@pega/cosmos-react-core';
import '../shared/create-nonce';
import CardIcon from './CardIcon';
import { ExpandableCardHeaderBadge, ExpandableCardView } from './ExpandableCardContent';
import StyledExpandableCardWrapper, { useCardTheme } from './styles';
import { booleanValue, hexColor, textValue } from './utils';
import type { ExpandableCardProps } from './types';

export type { ExpandableCardProps, IconBadgeProps } from './types';

export function DxdCustomUIExpandableCard(props: ExpandableCardProps) {
  const {
    getPConnect,
    iconName,
    subHeaderMode,
    subHeaderBadgeProps,
    subHeaderIconName,
    subHeaderForegroundColor,
    subHeaderBackgroundColor
  } = props;
  // Normalize configuration at the boundary: blank strings, invalid colors, and
  // serialized booleans should not leak into rendering or JavaScript truthiness checks.
  const header = textValue(props.header, 'Information');
  const subHeader = textValue(props.subHeaderText);
  const summary = textValue(props.summaryText);
  const headerView = textValue(props.additionalHeaderViewName);
  const detailsView = textValue(props.detailsViewName);
  const viewClass = textValue(props.viewClassName);
  const foreground = hexColor(props.foregroundColor, '#EC008C');
  const background = hexColor(props.backgroundColor, '#FCE4F2');
  const configuredExpanded = booleanValue(props.defaultExpanded);
  const [expanded, setExpanded] = useState(configuredExpanded);
  // User toggles remain local; changing the configured initial state resets the card
  // without writing any values back to the host's case data.
  useEffect(() => {
    setExpanded(configuredExpanded);
  }, [configuredExpanded]);
  const canToggle = booleanValue(props.allowToggle, true) && Boolean(detailsView);
  const showDetails = expanded && Boolean(detailsView);
  // Stable, per-instance IDs connect the heading and disclosure button to their
  // content even when several cards appear together in a view.
  const headingID = useId();
  const detailsID = useId();
  const cosmosTheme = useTheme();
  const { tokens, muiTheme } = useCardTheme(cosmosTheme);

  // Object-based badge configuration takes precedence over App Studio's individual
  // badge fields; omitted colors inherit the card's configured colors.
  const badgeProps = {
    iconName: textValue(
      subHeaderBadgeProps?.iconName,
      textValue(subHeaderIconName, 'InfoOutlined')
    ),
    header: textValue(subHeaderBadgeProps?.header, subHeader),
    foregroundColor: hexColor(
      subHeaderBadgeProps?.foregroundColor,
      hexColor(subHeaderForegroundColor, foreground)
    ),
    backgroundColor: hexColor(
      subHeaderBadgeProps?.backgroundColor,
      hexColor(subHeaderBackgroundColor, background)
    )
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <StyledExpandableCardWrapper
        theme={cosmosTheme}
        $tokens={tokens}
        role='region'
        aria-labelledby={headingID}
      >
        <Box sx={{ padding: tokens.padding }}>
          <Stack direction='row' alignItems='center' sx={{ gap: `calc(${tokens.gap} * 2)` }}>
            <Avatar
              aria-hidden
              sx={{
                width: tokens['avatar-size'],
                height: tokens['avatar-size'],
                bgcolor: background,
                color: foreground,
                fontSize: '1.5rem',
                flexShrink: 0
              }}
            >
              <CardIcon name={iconName} />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }}>
              <Typography
                id={headingID}
                component='h2'
                variant='h6'
                sx={{ color: foreground, fontWeight: 600, lineHeight: 1.4 }}
              >
                {header}
              </Typography>
              {subHeaderMode === 'badge' ? (
                <Box sx={{ mt: 0.5 }}>
                  <ExpandableCardHeaderBadge
                    getPConnect={getPConnect}
                    componentName={textValue(
                      props.subHeaderBadgeComponent,
                      'Dxd_CustomUI_IconBadge'
                    )}
                    badgeProps={badgeProps}
                  />
                </Box>
              ) : (
                subHeader && (
                  <Typography variant='body2' sx={{ mt: 0.5 }}>
                    {subHeader}
                  </Typography>
                )
              )}
            </Box>
            {canToggle && (
              <IconButton
                type='button'
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${header}`}
                aria-expanded={expanded}
                aria-controls={detailsID}
                onClick={() => setExpanded(value => !value)}
                sx={{ flexShrink: 0, color: 'inherit' }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Stack>
          {headerView && (
            <Box sx={{ mt: 2 }}>
              <ExpandableCardView
                name={headerView}
                className={viewClass}
                getPConnect={getPConnect}
              />
            </Box>
          )}
          {!showDetails && booleanValue(props.showSummary, true) && summary && (
            <Box sx={{ mt: 2, overflowWrap: 'anywhere' }}>
              <Divider sx={{ mb: 2, borderColor: tokens['border-color'] }} />
              <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                {summary}
              </Typography>
            </Box>
          )}
        </Box>
        {detailsView && (
          <Box id={detailsID} hidden={!showDetails}>
            {/* Keep the disclosure target in the DOM, but mount its view only when
                expanded so collapsed cards do not load details unnecessarily. */}
            {showDetails && (
              <>
                <Divider sx={{ borderColor: tokens['border-color'] }} />
                <Box sx={{ padding: tokens.padding, overflowWrap: 'anywhere', minWidth: 0 }}>
                  <ExpandableCardView
                    name={detailsView}
                    className={viewClass}
                    getPConnect={getPConnect}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </StyledExpandableCardWrapper>
    </ThemeProvider>
  );
}

// Supply the Cosmos configuration context expected by useTheme in host applications.
export default withConfiguration(DxdCustomUIExpandableCard);
