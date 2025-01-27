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
import UserForm from "./userForm";

interface User {
    _id: string;
    email: string;
    role: string;
}

const Operators = () => {
    const { data, loading, error, reload } = useFetch<User[]>('user/operators');
    console.log(data);

    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });


    //delete Operator

    const deleteOperator = async (id: string) => {
        try {
            await apiService.delete('user/' + id);
            toast.success('Operator deleted successfully');
        } catch (e: any) {
            toast.error(e || 'Failed to delete Operator');

        }
    }

    const pColumns: ColumnDef<User>[] = [
        createColumn("email", "Email", "w-[30%]"),
        createColumn("role", "role", "w-[30%]"),

        {
            id: "_id",
            enableHiding: false,
            header: "Actions",
            accessorKey: "_id",
            cell: ({ row }) => (
                <div className="flex justify-between gap-1 w-[125px]">
                    <MyDialog btnSize="default"
                        btnVaraient="default"
                        btnName={'Edit Operator'}
                        dialogTitle={'Edit Operator'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<UserForm selectedItem={row.original} reload={reload} />} />

                    <ConfirmDialog
                        btnVaraient="outline"
                        btnSize="default"
                        btnName="Delete"
                        dialogTitle="Do you want to delete this package?"
                        onClick={async () => {
                            deleteOperator(row.getValue("_id"));
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
                        btnName={'Add Operator'}
                        dialogTitle={'Add Operator'}
                        dialogDescription={""}
                        dialogWidth="w-[1000px]"
                        formElements={<UserForm reload={reload} />}
                    />} />}
        </div>
    );
}

export default Operators;
