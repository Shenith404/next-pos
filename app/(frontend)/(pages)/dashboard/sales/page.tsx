'use client'

import useFetch from "@/app/(frontend)/hooks/useFetch";
import useProcessing from "@/app/(frontend)/hooks/useProcessing";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { Order } from "@/app/(frontend)/types/interfaces";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm dialog";
import MyDialog from "@/components/ui/custom dialog";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import LoadingAnimation from "@/components/ui/loading animation";
import { ColumnDef } from "@tanstack/react-table";

import numeral from "numeral";
import printJS from "print-js";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Invoice from "./showOrder";





const Sales = () => {
    const { data, loading, error, reload } = useFetch<Order[]>('/order');
    const { processing, startProcessing, stopProcessing } = useProcessing();
    const [searchDate, setSearchDate] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Order[]>([]);
    console.log(data);

    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });

    const pColumns: ColumnDef<Order>[] = [
        createColumn("orderId", "OrderId", "w-[10%]"),
        createColumn("customerName", "Customer Name", "w-[15%]"),
        createColumn("phoneNumber", "Phone Number", "w-[10%]"),
        createColumn("amount", "Amount", "w-[5%]"),
        createColumn("discount", "Discount", "w-[5%]"),
        createColumn("updatedAt", "Updated Date", "w-[35%]"),


        {
            id: "_id",
            enableHiding: false,
            header: "Actions",
            accessorKey: "_id",
            cell: ({ row }) => (
                <div className="flex gap-1 justify-between  w-[20%]">
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'View'}
                        dialogTitle={'Invoice'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<Invoice bill={row.original} />}
                    />
                    <Button
                        onClick={() => { printJS(row.original.invoiceUrl); }}
                        variant="default" size="default" className="">
                        Invoice
                    </Button>
                    <ConfirmDialog
                        btnVaraient="outline"
                        btnSize="default"
                        btnName="Delete"
                        dialogTitle="Do you want to delete this order?"
                        onClick={() => {
                            removeOrder(row.getValue("_id"));
                            // Ensure the table reloads after deletion
                        }}
                        btnStyle="bg-red-400 hover:bg-red-300" formElements={undefined} />
                </div>
            ),
        },
    ];

    //removeOrder function
    const removeOrder = async (id: string) => {
        if (id) {
            startProcessing();
            try {
                await apiService.delete(`order/${id}`);

                await reload();
                toast.success("Order removed successfully");
            } catch (error: any) {
                toast.error(error || "An error occurred while removing order");

            } finally {
                stopProcessing();
            }
        }

    }


    useEffect(() => {
        if (!searchDate) {
            setFilteredData(data ?? []);
        } else {
            const result = data?.filter((item) => item.updatedAt.includes(searchDate));
            setFilteredData(result ?? []);
        }
    }, [searchDate, data]);


    const totalAmount = useMemo(() => {
        return filteredData.reduce((acc, item) => {

            if (item.isHold === false) {
                return acc + item.amount
            } else {
                return acc;
            }
        }, 0);
    }, [filteredData]);

    const holdTotalAmount = useMemo(() => {
        return filteredData.reduce((acc, item) => {

            if (item.isHold) {
                return acc + item.amount
            } else {
                return acc;
            }
        }, 0);
    }, [filteredData]);


    return (
        <div>
            {(loading || processing) ? <LoadingAnimation /> : <div className="relative">
                <div className=" place-items-center sm:absolute top-4 left-[210px] flex items-center justify-end  gap-3">
                    <div className="flex w-48 items-center justify-center border rounded-md border-gray-400 p-1.5">
                        <label className="mr-2 ">Date</label>
                        <input
                            className="focus:outline-none"
                            type="date"
                            value={searchDate}
                            onChange={(e) => {
                                setSearchDate(e.target.value)
                            }}
                        />
                    </div>
                    <Button onClick={() => setSearchDate('')} className="" >Clear Date</Button>
                </div>
                <CustomTable data={filteredData || []} columns={pColumns} addWindow={undefined} />
                <div className="relative flex gap-5">
                    {(searchDate !== '') ? <div className="sm:absolute -top-11 left-48 flex gap-5">
                        <div className="flex items-center gap-1">
                            <h1 className="font-semibold">Total :</h1>
                            <h1 className="font-bold">{numeral(totalAmount).format('0,0.00')} LKR</h1>
                        </div>
                        <div className="flex items-center gap-1">
                            <h1 className="font-semibold">Hold Total :</h1>
                            <h1 className="font-bold">{numeral(holdTotalAmount).format('0,0.00')} LKR</h1>
                        </div>
                    </div> : <h1 className="absolute -top-11 left-48 flex gap-5 font-semibold">Please Select a Date</h1>}
                    {/* <h1 className="absolute -top-6 left-48 font-semibold">Total : {numeral(totalAmount).format('0,0.00')}  Hold Total : {numeral(holdTotalAmount).format('0,0.00')}</h1> */}
                </div>
            </div>}

        </div>
    );
}

export default Sales;
