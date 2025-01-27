'use client'

import useFetch from "@/app/(frontend)/hooks/useFetch";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { Product } from "@/app/(frontend)/types/interfaces";
import ConfirmDialog from "@/components/ui/confirm dialog";
import MyDialog from "@/components/ui/custom dialog";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import LoadingAnimation from "@/components/ui/loading animation";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import ProductBarcodePDF from "./barcode/barcodeGenarateWindow";
import ProductForm from "./productForm";



const Products = () => {
    const { data, loading, error, reload } = useFetch<Product[]>('/Product');


    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });

    //delete category

    const deleteProduct = async (id: string) => {
        try {
            await apiService.delete('/Product/' + id);
            toast.success('Product deleted successfully');
        } catch (e: any) {
            toast.error(e || 'Failed to delete Product');

        }
    }

    const pColumns: ColumnDef<Product>[] = [
        createColumn("title", "Title", "w-[30%]"),
        createColumn("productId", "ProductId", "w-[5%]"),
        createColumn("category", "Category", "w-[10%]", "title"),
        createColumn("costPrice", "Cost Price", "w-[10%]"),
        createColumn("price", "Price", "w-[10%]"),
        createColumn("discount", "Discount", "w-[10%]"),


        {
            id: "_id",
            enableHiding: false,
            header: "Actions",
            accessorKey: "_id",
            cell: ({ row }) => (
                <div className="flex justify-between gap-1 w-[25%]">
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Barcode'}
                        dialogTitle={' Generate Barcode'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"

                        formElements={<ProductBarcodePDF product={row.original} />}
                    />
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Edit'}
                        dialogTitle={'Edit Product'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"

                        formElements={<ProductForm selectedItem={row.original} reload={reload} />}
                    />
                    <ConfirmDialog
                        btnVaraient="outline"
                        btnSize="default"
                        btnName="Delete"
                        dialogTitle="Do you want to delete this package?"
                        onClick={async () => {
                            deleteProduct(row.getValue("_id"));
                            await reload(); // Ensure the table reloads after deletion
                        }}
                        btnStyle="bg-red-400 hover:bg-red-300" formElements={undefined} />
                </div>
            ),
        },
    ];

    return (
        <div>
            {loading ? <LoadingAnimation /> : <CustomTable data={data || []} columns={pColumns} addWindow={<MyDialog btnSize="default"
                btnVaraient="default"
                btnName={'Add Product'}
                dialogTitle={'Add Product'}
                dialogDescription={""}
                dialogWidth="w-[1000px]"
                formElements={<ProductForm reload={reload} />}
            />} />}
        </div>
    );
}

export default Products;
