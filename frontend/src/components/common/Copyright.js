import React from 'react'

export default function Copyright() {
  const currentYear = new Date().getFullYear()
  return (
    <>
      Copyright © {currentYear} <strong>Dtyle.Ai Pvt.Ltd.</strong> All Rights
      Reserved.
    </>
  )
}
