export interface User {
    name: string;
    email: string;
    role: string;
    token: string;
    id: string;
}

export interface CustomJwtPayload {
    username: string;
    email: string;
    role: string;
    id: string;
    exp?: number;
}


export interface UserSession {
    user: User | null;
    isAuthenticated: boolean;
}
export interface DatabaseUser {
    _id: string;
    email: string;
    username: string;
    role: string;
    userId: string;
    createdDate: string; // ISO date string
    lastLogin: string; // ISO date string
}



export interface Package {
    name: string;
    description: string;
    price: number;
    features: string[];
    _id: string;
    createdDate: string;
    updatedDate: string;
    __v: number;
}
export interface Quotation {
    _id: string;
    relatedPackages: Package[];
    quotationStatus: string;
    email: string;
    contactNo: string;
    address: string;
    description: string;
    createdAt: string;
    __v: number;
}

export interface Appointment {
    _id: string;
    name: string;
    email: string;
    contactNo: string;
    address: string;
    description: string;
    date: string; // ISO date string
    time: string;
    appointmentStatus: string; // Assuming possible statuses
    createdAt: string; // ISO date string
    __v: number;
}

export interface GalleryImage {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    __v: number;
}

export interface OrderItem {
    // Define the structure of each item in the "items" array
    // Example fields:
    productId: string;
    quantity: number;
    productName: string;
    price: number;
    discount?: number;
}

export interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    phoneNumber: string;
    amount: number;
    discount: number;
    invoiceUrl: string;
    isHold: boolean;
    isReturned: boolean;
    holdReason?: string;
    items: OrderItem[];
    shopId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Category {
    _id: string;
    title: string;
}

export interface Product {
    _id: string;
    productId: string;
    title: string;
    category: Category;
    costPrice: number;
    price: number;
    discount: number;
    stock: number;
    damagedStock: number;
    image: string;
}