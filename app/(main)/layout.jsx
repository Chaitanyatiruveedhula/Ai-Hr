import React from 'react'
import { Header } from './dashboard/_components/Header'

const Mainlayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
export default Mainlayout
