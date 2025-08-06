import * as React from 'react'
import { useApp } from '@/context/AppContext'
import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material'

export default function Category2Autocomplete(props) {
  const { org } = useApp()
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] = React.useState(null)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await global.axios.get('/no-guards/category2', {
          params: {
            category1_id: props.category1_id,
            codeOrName: inputValue,
            limit: 10
          }
        })
        return res?.data?.categories2 || []
      } catch (e) {
        console.error(e)
      }
      return []
    }

    let active = true
    setLoading(true)

    const delay = setTimeout(async () => {
      const optionsFromServer = await getData()

      if (active) {
        setOptions(optionsFromServer)
        setLoading(false)
      }
    }, 500)

    // Cleanup function to clear the timeout if the component unmounts or inputValue changes
    return () => {
      active = false
      clearTimeout(delay)
    }
  }, [inputValue, props.category1_id])

  React.useEffect(() => {
    if (props.value && props.value.id && props.value.name) {
      if (value && value.id == props.value.id) return
      setValue(props.value)
    } else {
      setValue(null)
    }
  }, [props.value])

  const InputProps = props.InputProps || {}
  const AutocompleteProps = props.AutocompleteProps || {}

  return (
    <Autocomplete
      {...AutocompleteProps}
      value={value}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(option, value) =>
        option?.id === value?.id ? true : false
      }
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {option.name} ({option.code})
        </Box>
      )}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={org.category2}
          {...props.TextFieldProps}
          autoComplete='off'
          InputProps={{
            ...params.InputProps,
            ...InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
