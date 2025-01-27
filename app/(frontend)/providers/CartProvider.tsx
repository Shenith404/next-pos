'use client'

import React, { ReactNode } from 'react'
import { CartContextProvider } from '../context/cart'

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <CartContextProvider>
            {children}
        </CartContextProvider>
    )
}

export default CartProvider