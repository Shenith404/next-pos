'use client';
import useFetch from "@/app/(frontend)/hooks/useFetch";
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { Category } from "@/app/(frontend)/types/interfaces";
import { posSearchSchema } from "@/app/(frontend)/utils/validations";
import { Combobox } from "@/components/ui/combobox";
import CustomInput from "@/components/ui/input";
import LoadingAnimation from "@/components/ui/loading animation";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import printJS from "print-js";
import { useState } from "react";
import { toast } from "react-toastify";

const StockFrom = () => {
    const { data: categories, loading: categoryLoading, error: categoryError, reload: categoryReload } = useFetch<Category[]>('/category');
    const [genarating, setGenarating] = useState(false);
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

    const getPDF = async () => {

        setGenarating(true);
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
            setGenarating(false);
        }
    }

    // Format product data

    const getExcel = async () => {
        setGenarating(true); // Consider renaming this to `setGeneratingFile` for better clarity
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
            setGenarating(false); // Update variable name here if renamed
        }
    };

    return (
        <div>
            {categoryLoading ? <LoadingAnimation></LoadingAnimation> : <div className="grid grid-cols-2 gap-4">
                <CustomInput
                    className=""
                    label="Search"
                    type="string"
                    name="searchTerm"
                    value={values.searchTerm}
                    onchange={handleChange}
                    placeholder="Search"
                />
                <Combobox
                    value={values.category}
                    label="Category"
                    className=""
                    placeholder="Select category"
                    name="category"
                    options={categories?.map((ca) => ({ label: ca.title, value: ca.title })) || []}
                    onChange={
                        handleChange}
                />
                <ProgressButton width={"w-full"} title={"PDF"} handleClick={getPDF} isSubmitting={genarating} />
                <ProgressButton width={"w-full"} title={"EXCEL"} handleClick={getExcel} isSubmitting={genarating} />
            </div>}
        </div>
    )
}

export default StockFrom