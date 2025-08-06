import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ScrollToTop from './ScrollToTop'
import { useSession } from 'next-auth/react'
import TopNavbar from '@/components/_App/TopNavbar'
import LeftSidebar from '@/components/_App/LeftSidebar'
import Footer from '../common/Footer'

const Layout = ({ children }) => {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const { data: session, status } = useSession()

  const toogleActive = () => {
    setActive(!active)
  }

  const showPanel =
    status === 'authenticated' &&
    !(
      router.pathname === '/authentication/sign-in' ||
      router.pathname === '/authentication/forgot-password' ||
      router.pathname === '/authentication/lock-screen' ||
      router.pathname === '/authentication/confirm-mail' ||
      router.pathname === '/authentication/session-expired' ||
      router.pathname === '/authentication/logout'
    )

  return (
    <>
      <Head>
        <title> Dtyle.AI-Maritime Intelligence</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <div
          className={`${showPanel && 'main-wrapper-content'} ${
            active && 'active'
          }`}
        >
          {showPanel && (
            <>
              <TopNavbar toogleActive={toogleActive} />
              <LeftSidebar toogleActive={toogleActive} />
            </>
          )}

          <div className='main-content'>{children}</div>
        </div>

        <ScrollToTop />
        <div
          className={`${showPanel && 'main-wrapper-content-footer'} ${
            active && 'active'
          }`}
        >
          {showPanel && <Footer />}
        </div>
      </div>
    </>
  )
}

export default Layout
