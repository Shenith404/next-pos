import { FaCaretDown } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import Logo from "../../../assets/images/logo.jpg";
import DarkMode from "./DarkMode";

type NavBarProps = {
    handleOrderPopup?: () => void;
};

const Menu = [
    { id: 1, name: "Home", link: "/#" },
    { id: 2, name: "Top Rated", link: "/#services" },
    { id: 3, name: "Kids Wear", link: "/#" },
    { id: 4, name: "Mens Wear", link: "/#" },
    { id: 5, name: "Electronics", link: "/#" },
];

const DropdownLinks = [
    { id: 1, name: "Trending Products", link: "/#" },
    { id: 2, name: "Best Selling", link: "/#" },
    { id: 3, name: "Top Rated", link: "/#" },
];

const Navbar = ({ handleOrderPopup }: NavBarProps) => {
    return (
        <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
            {/* Upper Navbar */}
            <div className="bg-primary py-2">
                <div className="container flex justify-between items-center">
                    <a href="#" className="font-bold text-2xl sm:text-3xl flex items-center gap-2">
                        {/* <img src={Logo} alt="Logo" className="w-10" /> */}
                        SarisModels
                    </a>

                    {/* Search bar */}
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                            />
                            <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 transform -translate-y-1/2 right-3" />
                        </div>

                        {/* Order button */}
                        <button
                            onClick={handleOrderPopup}
                            className="bg-gradient-to-r from-primary to-secondary transition duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
                        >
                            <span className="hidden group-hover:block transition duration-200">Order</span>
                            <FaCartShopping className="text-xl text-white" />
                        </button>

                        {/* Dark mode switch */}
                        <DarkMode />
                    </div>
                </div>
            </div>

            {/* Lower Navbar */}
            <div data-aos="zoom-in" className="flex justify-center">
                <ul className="hidden sm:flex items-center gap-4">
                    {Menu.map((data) => (
                        <li key={data.id}>
                            <a href={data.link} className="px-4 hover:text-secondary duration-200">
                                {data.name}
                            </a>
                        </li>
                    ))}

                    {/* Dropdown menu */}
                    <li className="group relative cursor-pointer">
                        <a href="#" className="flex items-center gap-1 py-2">
                            Trending Products
                            <FaCaretDown className="transition duration-200 group-hover:rotate-180" />
                        </a>
                        <div className="absolute z-50 hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
                            <ul>
                                {DropdownLinks.map((data) => (
                                    <li key={data.id}>
                                        <a
                                            href={data.link}
                                            className="block w-full rounded-md p-2 hover:bg-primary/20"
                                        >
                                            {data.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
