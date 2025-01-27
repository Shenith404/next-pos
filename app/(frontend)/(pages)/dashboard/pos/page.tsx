'use client';
import { useCart } from "@/app/(frontend)/context/cart";
import useFetch from "@/app/(frontend)/hooks/useFetch";
import useForm from "@/app/(frontend)/hooks/useForm";
import { Category, Product } from "@/app/(frontend)/types/interfaces";
import { posSearchSchema } from "@/app/(frontend)/utils/validations";
import { Combobox } from "@/components/ui/combobox";
import CustomInput from "@/components/ui/input";
import LoadingAnimation from "@/components/ui/loading animation";
import Pagination from "@/components/ui/pagination";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductSection from "./productSection/prductSection";
const SummarySection = dynamic(() => import("./summarySection/summarySection"), { ssr: false });

const ITEM_PER_PAGE = 16;

const Pos = () => {
    const { data: products, loading: productLoading, error: productError, reload: productReload } = useFetch<Product[]>('/Product');
    const { data: categories, loading: categoryLoading, error: categoryError, reload: categoryReload } = useFetch<Category[]>('/category');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const { addToCart, clearCart } = useCart();

    //remove unwanted data form localsotrage
    useEffect(() => {
        if (localStorage.getItem('holdItems') === 'true') {
            clearCart();
            localStorage.setItem('holdItems', 'false');
        }

    }, [])

    const {
        values,
        handleChange,
        resetForm,
    } = useForm(
        {
            searchTerm: "",
            category: "",
        },
        posSearchSchema
    );

    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current page and filter term from search params
    const currentPage = useMemo(() => {
        const page = parseInt(searchParams.get('page') || '1');
        return page > 0 ? page : 1;
    }, [searchParams]);

    const filterTerm = useMemo(() => searchParams.get('category') || '', [searchParams]);

    // Pagination calculations
    const totalPages = useMemo(() => Math.ceil(filteredProducts.length / ITEM_PER_PAGE), [filteredProducts]);
    const startIndex = (currentPage - 1) * ITEM_PER_PAGE;

    // Handle pagination navigation
    const handlePageChange = (page: number) => {
        router.replace(`?page=${page}&category=${filterTerm}`);
    };

    // Update filter term
    const setFilterTerm = (category: string) => {
        const event = {
            target: {
                name: 'category',
                value: category,
            },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
        router.replace(`?page=1&category=${category}`);
    };

    // Filter products based on search term and category
    useEffect(() => {
        const filtered = products?.filter(product => {
            const categoryTitle = typeof product.category !== 'string' ? product.category?.title.toLowerCase() : '';
            return categoryTitle.includes(filterTerm.toLowerCase());
        }) || [];

        const searchedProducts = filtered.filter(product =>
            product.title.toLowerCase().includes(values.searchTerm.toLowerCase())
        );

        setFilteredProducts(searchedProducts);
    }, [values.searchTerm, filterTerm, products]);

    // Generate page numbers
    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);



    //bar code

    const [inputBuffer, setInputBuffer] = useState(""); // Buffer for key presses

    useEffect(() => {
        const handleKeyPress = (e: any) => {
            // Check if Enter key is pressed (key code 13)
            if (e.key === "Enter") {
                var product = products?.find((product) => product._id!.toLowerCase() === inputBuffer.toLowerCase());
                if (product) {
                    addToCart(product as any);
                    toast.success(product.title + " added to cart");
                }

                setInputBuffer(""); // Clear the buffer
            } else {
                // Append the character to the buffer
                setInputBuffer((prev) => prev + e.key);
            }
        };

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [inputBuffer]);


    return (
        <div className="w-full flex items-start">
            {/* Products Section */}
            <div className="bg-gray-100 w-full lg:[width:calc(100%-500px)] min-h-screen flex flex-col p-4">
                {/* title */}
                <h1 className="text-xl font-semibold  my-4 ml-1">POS Section</h1>

                {/* Filtering Section */}
                <div className="flex gap-4 items-center justify-start mb-2">
                    <CustomInput
                        className="sm:w-[250px]"
                        type="string"
                        name="searchTerm"
                        value={values.searchTerm}
                        onchange={handleChange}
                        placeholder="Search"
                    />
                    <Combobox
                        value={values.category}
                        className="sm:w-[250px]"
                        placeholder="Select category"
                        name="category"
                        options={categories?.map((ca) => ({ label: ca.title, value: ca.title })) || []}
                        onChange={
                            (e: any) => { handleChange(e); setFilterTerm(e.target.value); }

                        }
                    />
                </div>
                {/* Products */}
                {!(categoryLoading || productLoading) ? <ProductSection data={filteredProducts.slice(startIndex, startIndex + ITEM_PER_PAGE)} /> : <LoadingAnimation />}
                {/* Pagination */}
                <div className="flex gap-2 justify-center mt-4">
                    <Pagination totalPages={pageNumbers.length} currentPage={currentPage} onPageChange={handlePageChange} />
                </div>
            </div>

            {/* Summary Section */}
            <div className="hidden lg:block sm:w-[500px] min-h-screen">
                <SummarySection />
            </div>
        </div>
    );
};

export default Pos;
