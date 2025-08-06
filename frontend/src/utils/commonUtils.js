export const getUserName = (session) => {
  if (!session?.data?.user) return ''
  const user = session.data.user
  if (user) return `${user.name} (${user.emailid})`
  return ''
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
