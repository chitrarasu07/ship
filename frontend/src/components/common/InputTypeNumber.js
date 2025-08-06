import React from 'react'
import TextField from '@mui/material/TextField'

const InputTypeNumber = (props) => {
  const { onChange } = props
  const handleChange = (event) => {
    const inputValue = event.target.value

    if (/^[0-9]*$/.test(inputValue)) {
      onChange(inputValue)
    }
  }

  const handleKeyDown = (event) => {
    if (
      !(
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Delete' ||
        event.key === 'Backspace' ||
        (event.key >= '0' && event.key <= '9')
      )
    ) {
      event.preventDefault()
    }
  }

  return (
    <TextField {...props} onChange={handleChange} onKeyDown={handleKeyDown} />
  )
}

export default InputTypeNumber
