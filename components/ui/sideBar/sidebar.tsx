"use client";
import { useUser } from "@/app/(frontend)/context/user";
import allowableRoutes from "@/config/allowbleRoutes";
import { Building, Building2Icon, DollarSign, History, HomeIcon, LogOut, Receipt, ReceiptTextIcon, Settings, ShoppingBag, ShoppingBasket, ShoppingCartIcon, StoreIcon, User, Users, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sideBarItems = [
    {
        title: "MENU",
        items: [
            {
                icon: <HomeIcon />,
                label: "Home",
                href: "home",
            },
            {
                icon: <Users />,
                label: "Operators",
                href: "operators",
            },
            {
                icon: <ShoppingBag />,
                label: "Shops",
                href: "shops",
            },
            {
                icon: <UsersIcon />,
                label: "Owners",
                href: "owners",
            },
            {
                icon: <ShoppingBasket />,
                label: "Categories",
                href: "categories",
            },
            {
                icon: <ShoppingCartIcon />,
                label: "Products",
                href: "products",
            },

            {
                icon: <StoreIcon />,
                label: "Stock",
                href: "stock",
            },
            {
                icon: <DollarSign />,
                label: "Sales",
                href: "sales",
            },
            {
                icon: <Receipt />,
                label: "On Hold Bills",
                href: "onholdbills",
            },
            {
                icon: <Building2Icon />,
                label: "Pos",
                href: "pos",
            },
            {
                icon: <Building />,
                label: "Returns",
                href: "returns",
            },
            {
                icon: <History />,
                label: "history",
                href: "history",
            },
            {
                icon: <ReceiptTextIcon />,
                label: "Reports",
                href: "reports",
            },







        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: <User />,
                label: "Profile",
                href: "/profile",
            },
            {
                icon: <Settings />,
                label: "Settings",
                href: "settings",
            },
            {
                icon: <LogOut />,
                label: "Logout",
                href: "/logout",
            },
        ],
    },
];

const SideBar = () => {
    const pathname = usePathname();
    const customizedPath = pathname.split("/")[2];
    const { user } = useUser();
    const userRole = (user?.role || 'SHOP_OPERATOR') as keyof typeof allowableRoutes;
    console.log("userRole", userRole);
    return (
        <div className="mt-4  text-sm">
            {sideBarItems.map((i) => (
                <div className="flex flex-col gap-2" key={i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">
                        {i.title}
                    </span>
                    {i.items.map((item) => {
                        const route = item.href.replace('/', '');
                        if (allowableRoutes[userRole].includes(route)) {
                            return (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className={`flex items-center text-[15px] font-bold   justify-center lg:justify-start gap-4 text-gray-50 py-2 md:px-2 rounded-md ${customizedPath === item.href ? "bg-secondary/40" : "hover:bg-secondary"
                                        }`}
                                >
                                    <div className="text-gray-50 w-8 item-center flex justify-start">{item.icon}</div>
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>
    );
};

export default SideBar;

// import allowbleRoutes from "@/config/allowble_routes";
// import { LogOut } from "lucide-react";
// import { useMemo } from "react";
// import { FaSuitcase } from "react-icons/fa";
// import { LuBox, LuCalendar, LuMessageSquare, LuUser } from "react-icons/lu";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../../assets/images/logo.jpg";

// const Sidebar = () => {
//     const location = useLocation();
//     const pathSegments = location.pathname.split('/').filter(Boolean);
//     const target = pathSegments[1] || 'home';

//     const SIDEBAR_LINKS = useMemo(() => [
//         { id: 1, path: "/dashboard/", name: "Home", icon: LuBox },
//         { id: 2, path: "/dashboard/packages", name: "Packages", icon: LuCalendar },
//         { id: 3, path: "/dashboard/appointments", name: "Appointments", icon: LuMessageSquare },
//         { id: 4, path: "/dashboard/quotations", name: "Quotations", icon: LuMessageSquare },
//         { id: 5, path: "/dashboard/gallery", name: "Gallery", icon: FaSuitcase },
//         { id: 6, path: "/dashboard/services", name: "Services", icon: LuUser },
//         { id: 7, path: "/dashboard/users", name: "Users", icon: LuUser },

//     ], []);

//     const filteredLinks = useMemo(() => {
//         return SIDEBAR_LINKS.filter(link =>
//             allowbleRoutes.Admin.includes(link.name.toLowerCase())
//         );
//     }, [SIDEBAR_LINKS]);

//     return (
//         <div className="w-16 md:w-56 fixed left-0 top-0 z-30 border h-screen pt-8 px-4 bg-white">
//             {/* logo */}
//             <div className="mb-8">
//                 <div className="justify-start items-center hidden md:flex">
//                     {/* <img src={logo} alt="logo" className="w-[50px]" /> */}
//                     <h1>Photography</h1>
//                 </div>
//                 {/* <img src="/logo_mini.svg" alt="logo" className="w-8 flex md:hidden" /> */}
//             </div>
//             {/* logo */}

//             {/* Navigation Links */}
//             <ul className="mt-6 space-y-6">
//                 {filteredLinks.map(link => (
//                     <div key={link.id}>
//                         <Link to={link.path} className=" w-full  ">
//                             <li key={link.id} className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-secondary ${target === link.name.toLowerCase() ? "bg-primary/20 text-primary" : ""}`}>
//                                 <div className="flex justify-center md:justify-start items-center w-full ">
//                                     <span>{link.icon({})}</span>
//                                     <span className="text-sm ml-2 text-gray-500 hidden md:flex">
//                                         {link.name}
//                                     </span>
//                                 </div>
//                             </li>
//                         </Link>
//                     </div>
//                 ))}
//             </ul>
//             {/* Navigation Links */}

//             <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
//                 <p className="flex items-center space-x-2 text-xs text-white py-2 px-5 bg-primary rounded-full">
//                     <LogOut />
//                     <span className="hidden md:flex">Log Out</span>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;