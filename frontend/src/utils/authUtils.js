import jwt from 'jsonwebtoken'

export const decodeJwt = (token) => {
  try {
    return jwt.decode(token)
  } catch (e) {
    console.error('decodeJwt', e)
    return ''
  }
}

export const hasPermission = (pagesWantToAccess) => {
  if (!pagesWantToAccess?.length) return false
  const cached = sessionStorage.getItem('my-roles')
  if (!cached) return false

  const parsed = JSON.parse(cached)
  if (!parsed?.role?.pages?.length) return false

  for (let i = 0; i < pagesWantToAccess.length; i++) {
    if (parsed.role.pages.indexOf(pagesWantToAccess[i]) > -1) return true
  }

  return false
}
