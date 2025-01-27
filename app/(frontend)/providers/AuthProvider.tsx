'use client'

import React, { ReactNode } from 'react'
import { UserProvider } from '../context/user'

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
        {children}
    </UserProvider>
  )
}

export default AuthProvider