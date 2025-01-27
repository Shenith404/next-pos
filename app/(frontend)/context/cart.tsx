import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface CartItem {
    _id: string; // Changed to match your context `id`
    quantity: number;
    [key: string]: any; // Allows for additional item properties
}

interface CartContextProps {
    children: ReactNode;
}

interface CartContextValue {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    handleRemove: (item: CartItem) => void;
    handleIncrement: (item: CartItem) => void;
    handleDecrement: (item: CartItem) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "cart";

export const CartContextProvider: React.FC<CartContextProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize cart from localStorage on client-side only
    useEffect(() => {
        const savedCart = typeof window !== 'undefined' 
            ? localStorage.getItem(CART_STORAGE_KEY)
            : null;
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setIsInitialized(true);
    }, []);

    // Update localStorage when cart changes
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            console.log(cart);
        }
    }, [cart, isInitialized]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem._id === item._id
            );
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const handleRemove = (item: CartItem) => {
        setCart((prevCart) =>
            prevCart.filter((cartItem) => cartItem._id !== item._id)
        );
    };

    const handleIncrement = (item: CartItem) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        );
    };

    const handleDecrement = (item: CartItem) => {
        setCart((prevCart) =>
            prevCart
                .map((cartItem) =>
                    cartItem._id === item._id
                        ? {
                            ...cartItem,
                            quantity: Math.max(cartItem.quantity - 1, 1),
                        }
                        : cartItem
                )
                .filter((cartItem) => cartItem.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                handleRemove,
                handleIncrement,
                handleDecrement,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextValue => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
