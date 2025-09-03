import * as React from 'react'
import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material'

export default function ReferenceValuesAutocomplete(props) {
  const { referenceValues = [], multiple = false } = props
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState(referenceValues)
  const [loading, setLoading] = React.useState(false) // can set true if you want loading indicator while filtering
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] = React.useState(multiple ? [] : null)

  // Sync options when referenceValues update
  React.useEffect(() => {
    setOptions(referenceValues)
  }, [referenceValues])

  // Sync controlled value from props
  React.useEffect(() => {
    if (multiple) {
      setValue(Array.isArray(props.value) ? props.value : [])
    } else {
      if (value?.id === props.value?.id) return
      setValue(props.value)
    }
  }, [props.value, multiple])

  // Filter options locally based on inputValue (optional)
  // If needed, you can add a filtering logic here or skip if Autocomplete does built-in filtering

  const InputProps = props.InputProps || {}
  const AutocompleteProps = props.AutocompleteProps || {}

  return (
    <Autocomplete
      {...AutocompleteProps}
      multiple={multiple}
      options={options}
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, val) => option?.id === val?.id}
      getOptionLabel={(option) => option?.name || ''}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {option.name} ({option.code})
        </Box>
      )}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || 'Select Reference'}
          {...props.TextFieldProps}
          autoComplete='off'
          InputProps={{
            ...params.InputProps,
            ...InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}
