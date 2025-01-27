'use client';
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { Combobox } from "@/components/ui/combobox";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import printJS from "print-js";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const formatDate = (date: Date | number) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};
const SalesForm = () => {
    const [fromDate, setFromDate] = useState(formatDate(new Date().setMonth(new Date().getMonth() - 1)));
    const [toDate, setToDate] = useState(formatDate(new Date()));
    const [generating, setGenerating] = useState(false);
    const {
        values,
        handleChange,
        resetForm,
    } = useForm(
        {
            option: "ToDay",
        },
        z.object({
            option: z.string(),
        })

    );


    const getSalesReportPDF = async () => {
        setGenerating(true);
        try {
            // Fetching the report as a Blob (binary data)
            let response: any;
            if (values.option === 'ToDay') {
                response = await apiService.get('/reports/sales/ToDay', {
                    responseType: 'blob' // Ensure the response is treated as a blob (binary data)
                });
            } else {
                response = await apiService.get(`/reports/sales?startDate=${fromDate}&endDate=${toDate}`, {
                    responseType: 'blob'
                });
            }

            // Create a URL for the Blob (PDF)
            const pdfUrl = URL.createObjectURL(response);

            // Use printJS to print the PDF
            printJS({
                printable: pdfUrl,
                type: 'pdf',
            });

            // Optionally, you can revoke the object URL after use to free memory
            URL.revokeObjectURL(pdfUrl);

        } catch (error: any) {
            console.log('error', error.message);
            toast.error(error.message || 'Server error ,please try again');
        }
        finally {
            setGenerating(false);
        }

    };



    const getSalesReportEXCEL = async () => {
        setGenerating(true);
        try {
            // Fetching the report as a Blob (binary data)
            let response: any;
            if (values.option === "ToDay") {
                response = await apiService.get("/reportsExcel/sales/ToDay", {
                    responseType: "blob", // Ensure the response is treated as a blob (binary data)
                });
            } else {
                response = await apiService.get(
                    `/reportsExcel/sales?startDate=${fromDate}&endDate=${toDate}`,
                    {
                        responseType: "blob",
                    }
                );
            }

            // Create a URL for the Blob (Excel file)
            const excelUrl = URL.createObjectURL(
                new Blob([response], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
            );

            // Create a temporary link to trigger the download
            const link = document.createElement("a");
            link.href = excelUrl;
            link.download = `Sales_Report_${values.option === "ToDay" ? "ToDay" : `${fromDate}_to_${toDate}`}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Clean up the link and revoke the URL
            document.body.removeChild(link);
            URL.revokeObjectURL(excelUrl);
        } catch (error: any) {
            console.log("error", error.message);
            toast.error(error.message || "Server error, please try again");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <Combobox name={"option"} options={[
                { label: "ToDay", value: "ToDay" },
                { label: "Custom", value: "Custom" },

            ]} onChange={handleChange} value={values.option} />


            {values.option === 'Custom' &&


                <div className=" my-3">
                    <div className="flex items-center justify-center border-[2px] border-primary p-2">
                        <label className="mr-2 font-bold">From</label>
                        <input
                            className="focus:outline-none"

                            type="date"
                            value={fromDate}
                            onChange={(e) => {
                                if (e.target.value > toDate) {
                                    toast.error('From date cannot be greater than to date');
                                    setFromDate(formatDate(new Date()))
                                    return;
                                }

                                setFromDate(e.target.value)
                            }}
                        />
                    </div>

                    <div className="flex mt-1 items-center justify-center border-[2px] border-primary p-2">
                        <label className="mr-2 font-bold">To</label>
                        <input
                            className="focus:outline-none"
                            type="date"
                            value={toDate}
                            onChange={(e) => {
                                if (e.target.value < fromDate) {
                                    toast.error('To date cannot be less than from date');
                                    setToDate(formatDate(new Date()));

                                    return;

                                }
                                setToDate(e.target.value);
                            }}
                        />
                    </div>
                </div>


            }
            <div className="grid grid-cols-2 gap-4">

                <ProgressButton width={"w-full"} title={"PDF"} handleClick={getSalesReportPDF} isSubmitting={generating} />
                <ProgressButton width={"w-full"} title={"EXCEL"} handleClick={getSalesReportEXCEL} isSubmitting={generating} />

            </div>

        </div>
    )
}

export default SalesForm