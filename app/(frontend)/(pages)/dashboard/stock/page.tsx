'use client'

import useFetch from "@/app/(frontend)/hooks/useFetch";
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { Combobox } from "@/components/ui/combobox";
import MyDialog from "@/components/ui/custom dialog";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import CustomInput from "@/components/ui/input";
import LoadingAnimation from "@/components/ui/loading animation";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import { ColumnDef } from "@tanstack/react-table";
import printJS from "print-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import UpdateStock from "./updataStock";

const searchSchema = z.object({
    searchTerm: z.string(),
    category: z.string()
});

interface Category {
    _id: string;
    title: string;
}

interface Product {
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

const Stock = () => {
    const { data, loading, error, reload } = useFetch<Product[]>('/Product');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [genaratingPDF, setGenaratingPDF] = useState(false);

    // Get categories
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response: Category[] = await apiService.get("/category");
                setCategories(response);
            } catch (error: any) {
                toast.error(error.message || "Server error, please try again");
            }
        }

        getCategories();
    }, []);


    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setErrors,
        setValues,
    } = useForm(
        {
            searchTerm: "",
            category: "",
        },
        searchSchema
    );

    const pColumns: ColumnDef<Product>[] = [
        createColumn("title", "Title", "w-[30%]"),
        createColumn("productId", "ProductId", "w-[5%]"),
        createColumn("category", "Category", "w-[10%]", "title"),
        createColumn("stock", "Stock", "w-[10%]"),
        createColumn("damagedStock", "Damaged Stock", "w-[10%]"),

        {
            id: "_id",
            enableHiding: false,
            header: "Change Stock",
            accessorKey: "_id",
            cell: ({ row }) => (
                <div className="flex gap-1 justify-between w-[35%]">
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Main Stock'}
                        dialogTitle={'Update Main Stock'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<UpdateStock type="main" selectedItem={row.original} reload={reload} />}
                    />

                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Damage Stock'}
                        dialogTitle={'Update Damage Stock'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<UpdateStock type="damaged" selectedItem={row.original} reload={reload} />}
                    />
                </div>
            ),
        },
    ];


    // Filter products based on search and category
    useEffect(() => {
        const filtered = data?.filter((product) => {
            console.log(product)
            const categoryTitle = product.category?.title?.toLowerCase() || "";
            const matchesCategory = categoryTitle.includes(values.category.toLowerCase());
            const matchesSearch = product.title.toLowerCase().includes(values.searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        setFilteredProducts(filtered ?? []);
    }, [values.category, values.searchTerm, data]);


    const getPDF = async () => {
        if (filteredProducts.length < 0) return;
        setGenaratingPDF(true);
        try {
            const response: any = await apiService.get(`/reports/stock?categoryTitle=${values.category}&search=${values.searchTerm}`, {
                responseType: "blob",
            });
            const pdfUrl = URL.createObjectURL(response);
            printJS({
                printable: pdfUrl,
                type: "pdf",
            });
            URL.revokeObjectURL(pdfUrl);
        } catch (error: any) {
            toast.error(error.message || "Server error, please try again");
        } finally {
            setGenaratingPDF(false);
        }
    }

    // Format product data

    const getExcel = async () => {
        if (filteredProducts.length <= 0) return; // Fixed comparison to `<=` instead of `<`
        setGenaratingPDF(true); // Consider renaming this to `setGeneratingFile` for better clarity
        try {
            const response: any = await apiService.get(
                `/reportsExcel/stock?categoryTitle=${values.category}&search=${values.searchTerm}`,
                {
                    responseType: "blob",
                }
            );
            // Create a Blob URL for the Excel file
            const excelUrl = URL.createObjectURL(new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));

            // Create a temporary link to trigger the download
            const link = document.createElement("a");
            link.href = excelUrl;
            link.download = `Stock_Report_${values.category || "All"}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Clean up the link and revoke the URL
            document.body.removeChild(link);
            URL.revokeObjectURL(excelUrl);
        } catch (error: any) {
            toast.error(error.message || "Server error, please try again");
        } finally {
            setGenaratingPDF(false); // Update variable name here if renamed
        }
    };

    return (
        <div>
            {/* Filters */}
            <div className="grid place-items-center grid-cols-2 gap-2  sm:flex sm:gap-1  sm:absolute sm:top-[112px] justify-between items-center">
                <CustomInput
                    name="searchTerm"
                    className="w-[200px] "
                    placeholder="Search an item"
                    value={values.searchTerm} type={"string"} onchange={handleChange}
                />
                <Combobox className="w-[200px] " value={values.category} name={'category'} options={categories?.map((c: Category) => {
                    return { value: c.title, label: c.title }
                }) || []} onChange={handleChange} error={errors.category} />

                <ProgressButton width={""} title={"PDF"} handleClick={getPDF} isSubmitting={genaratingPDF} />
                <ProgressButton width={""} title={"EXCEL"} handleClick={getExcel} isSubmitting={genaratingPDF} />

            </div>
            {loading ? <LoadingAnimation /> : <CustomTable searchInput={false} data={filteredProducts || []} columns={pColumns} addWindow={undefined} />}
        </div>
    );
}

export default Stock;
