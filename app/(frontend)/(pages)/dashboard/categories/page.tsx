'use client'

import useFetch from "@/app/(frontend)/hooks/useFetch";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import ConfirmDialog from "@/components/ui/confirm dialog";
import MyDialog from "@/components/ui/custom dialog";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import LoadingAnimation from "@/components/ui/loading animation";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import CreateCategory from "./categoryForm";

interface Category {
    _id: string;
    categoryId: string;
    productCount: number;
    shopId: string;
    slug: string;
    title: string;
    __v: number;
}

const Categories = () => {
    const { data, loading, error, reload } = useFetch<Category[]>('/category');
    console.log(data);

    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });


    //delete category

    const deleteCategory = async (id: string) => {
        try {
           await apiService.delete('/category/' + id);
            toast.success('Category deleted successfully');
        } catch (e: any) {
            toast.error(e || 'Failed to delete category');

        }
    }

    const pColumns: ColumnDef<Category>[] = [
        createColumn("title", "Title", "w-[30%]"),
        createColumn("categoryId", "ID", "w-[30%]"),
        createColumn("productCount", "Product Count", "w-[30%]"),

        {
            id: "_id",
            enableHiding: false,
            header: "Actions",
            accessorKey: "_id",
            cell: ({ row }) => (
                <div className="flex justify-between gap-1 w-[125px]">

                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Edit'}
                        dialogTitle={'Edit Category'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<CreateCategory selectedItem={row.original} reload={reload} />}
                    />
                    <ConfirmDialog
                        btnVaraient="outline"
                        btnSize="default"
                        btnName="Delete"
                        dialogTitle="Do you want to delete this package?"
                        onClick={async () => {
                            deleteCategory(row.getValue("_id"));
                            reload();

                        }}
                        btnStyle="bg-red-400 hover:bg-red-300" formElements={undefined} />
                </div>
            ),
        },
    ];

    return (
        <div>
            {loading ? <LoadingAnimation /> :
                <CustomTable data={data || []} columns={pColumns}

                    addWindow={<MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Add Category'}
                        dialogTitle={'Add Category'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<CreateCategory reload={reload} />}
                    />} />}
        </div>
    );
}

export default Categories;
