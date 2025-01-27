'use client'

import { useUser } from "@/app/(frontend)/context/user";
import useFetch from "@/app/(frontend)/hooks/useFetch";
import CustomTable from "@/components/ui/custom table";
import { createSortingColumn } from "@/components/ui/custom table/custom column";
import LoadingAnimation from "@/components/ui/loading animation";
import { ColumnDef } from "@tanstack/react-table";

interface ActionLog {
    _id: string;
    action: string;
    createdAt: string;
    role: string;
    shopId: string;
    userName: string;
    __v: number;
}


const Sales = () => {
    const { user } = useUser();
    const { data, loading, error, reload } = useFetch<ActionLog[]>(`/logs/${user?.role === 'ADMINISTRATOR' ? 'admin' : (user?.role === 'SHOP_OWNER' ? 'shop-owner' : 'shop-operator')}`);
    console.log(data);

    // Column definition helper
    const createColumn = (accessorKey: string, headerTitle: string, width: string, value?: string) =>
        createSortingColumn({ accessorKey, headerTitle, width, value });

    const pColumns: ColumnDef<ActionLog>[] = [
        createColumn("userName", "UserName", "w-[10%]"),
        createColumn("action", "Action", "w-[40%]"),
        createColumn("role", "Role", "w-[10%]"),
        createColumn("createdAt", "Created Date", "w-[30 %]"),




    ];

    return (
        <div>
            {loading ? <LoadingAnimation /> : <CustomTable data={data || []} columns={pColumns} addWindow={undefined} />}
        </div>
    );
}

export default Sales;
