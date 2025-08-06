import * as React from 'react'

export const SCDocName = ({ docname }) => (
  <div style={fileNameStyles}>
    <div style={fileNameInnerStyles}>{docname}</div>
  </div>
)

const fileNameStyles = {
  position: 'absolute',
  left: '0',
  right: '0',
  display: 'flex',
  WebkitAlignItems: 'center',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  bottom: '0'
}

const fileNameInnerStyles = {
  WebkitBoxFlex: '1',
  WebkitFlexGrow: '1',
  flexGrow: '1',
  padding: '12px 16px',
  color: '#fff',
  overflow: 'hidden',
  paddingRight: '0',
  wordWrap: 'break-word',
  background: 'rgba(0, 0, 0, 0.5)'
}
