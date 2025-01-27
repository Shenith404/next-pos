'use client'

import { useUser } from "@/app/(frontend)/context/user";
import useFetch from "@/app/(frontend)/hooks/useFetch";
import useProcessing from "@/app/(frontend)/hooks/useProcessing";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import ConfirmDialog from "@/components/ui/confirm dialog";
import MyDialog from "@/components/ui/custom dialog";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import LoadingAnimation from "@/components/ui/loading animation";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import Invoice from "./showOrder";

interface OrderItem {
    // Define the structure of each item in the "items" array
    // Example fields:
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
}

interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    phoneNumber: string;
    amount: number;
    discount: number;
    invoiceUrl: string;
    isHold: boolean;
    isReturned: boolean;
    items: OrderItem[];
    shopId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


const OnHoldBills = () => {
    const { data, loading, error, reload } = useFetch<Order[]>('/order/on-hold');
    const { user } = useUser();
    const { processing, startProcessing, stopProcessing } = useProcessing();
    console.log(data);



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
                <div className="flex justify-between w-[15%] gap-1">
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'View'}
                        dialogTitle={'Invoice'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<Invoice bill={row.original as any} />} />
                    {user?.role === 'SHOP_OWNER' && <ConfirmDialog
                        btnVaraient="outline"
                        btnSize="default"
                        btnName="Delete"
                        dialogTitle="Do you want to delete this order?"
                        onClick={() => {
                            removeOrder(row.getValue("_id"));
                            // Ensure the table reloads after deletion
                        }}
                        btnStyle="bg-red-400 hover:bg-red-300" formElements={undefined} />}
                </div>
            ),
        },
    ];

    return (
        <div>
            {(loading || processing) ? <LoadingAnimation /> : <CustomTable data={data || []} columns={pColumns} addWindow={undefined} />}
        </div>
    );
}

export default OnHoldBills;
