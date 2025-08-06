import axios from 'axios'
import { getServerSession } from 'next-auth'
import { authOptions } from './pages/api/auth/[...nextauth]'

axios.defaults.baseURL = (process.env.API_SERVER_HOST || '') + '/api'

// axios.interceptors.request.use((config) => {
//   if (config.url.indexOf('/api/noauth/') > -1) {
//     config.baseURL = config.baseURL?.replace(basePath, '')
//   }

//   console.log('config.baseURL', config.baseURL, config.url)
//   return config
// })

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      globalThis.location &&
      globalThis.location.href != '/authentication/session-expired' &&
      globalThis.location.href != '/authentication/logout'
    ) {
      if (error.response.data.error == 'Session Expired') {
        globalThis.location.href = '/authentication/session-expired'
      } else {
        globalThis.location.href = '/authentication/logout'
      }
    } else {
      return Promise.reject(error)
    }
  }
)

const _axios = {}
global.axios = axios

_axios.getServerAxios = async function (req, res, ses) {
  try {
    const session = ses || (await getServerSession(req, res, authOptions))
    if (!session || !session.user || !session.user.token) return null

    const axiosObj = axios.create({
      headers: {
        Authorization: 'Bearer ' + session.user.token
      }
    })

    return axiosObj
  } catch (e) {
    return null
  }
}

export default _axios
