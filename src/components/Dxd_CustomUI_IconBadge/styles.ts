import styled from 'styled-components';

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  box-sizing: border-box;
  max-width: 100%;
  padding: 0.375rem 1rem;
  border-radius: 999px;
  vertical-align: middle;
  font-family: inherit;
  font-size: var(--icon-badge-font-size, 1rem);
  font-weight: 500;
  line-height: 1.5;

  .badge-icon {
    flex-shrink: 0;
    width: var(--icon-badge-icon-size, 1.5em);
    height: var(--icon-badge-icon-size, 1.5em);
    font-size: inherit;
    color: inherit;
  }

  .badge-label {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

export default StyledBadge;
