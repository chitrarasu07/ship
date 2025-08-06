import React from 'react'
import styles from '@/styles/PageTitle.module.css'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'

import _axios from '@/_axios'
import { getUserName } from '@/utils/commonUtils'
import { authOptions } from './api/auth/[...nextauth]'

function redirect(destination) {
  return {
    redirect: {
      destination,
      permanent: false
    }
  }
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session?.user) return redirect('/authentication/session-expired')

  const axiosInstance = await _axios.getServerAxios(
    context.req,
    context.res,
    session
  )

  const user = session.user
  if (!axiosInstance) return { props: { user } }

  let role,
    organization,
    allAvailableRoles = null
  try {
    const myRoleRes = await axiosInstance.get('/no-guards/my-roles', {
      params: { getAvailableRoles: true }
    })
    role = myRoleRes.data.role
    organization = myRoleRes.data.organization
    allAvailableRoles = myRoleRes.data.allAvailableRoles
  } catch (e) {
    return redirect(
      '/authentication/session-expired?msg=' +
        (e.response?.data?.error || 'unknown')
    )
  }

  if (!role || !organization) {
    return redirect(
      '/authentication/session-expired?msg=Role or organization are not found'
    )
  }

  if (role.landing_page && allAvailableRoles?.length) {
    const matched = allAvailableRoles.find((r) => r.page == role.landing_page)
    if (matched && matched.urlPath) {
      return redirect(matched.urlPath)
    }
  }

  return {
    props: {
      user,
      role,
      organization
    }
  }
}

const HomePage = () => {
  const session = useSession()
  const [name, setName] = useState(null)

  useEffect(() => {
    setName(getUserName(session))
  }, [session])

  return (
    <>
      <div className={styles.pageTitle}>
        <h1
          style={{
            fontStyle: 'normal',
            fontWeight: '800',
            fontSize: '24px',
            lineHeight: '29px',
            paddingLeft: '20px'
          }}
        >
          Hey {name}, Welcome back...!
        </h1>
      </div>
    </>
  )
}

export default HomePage
