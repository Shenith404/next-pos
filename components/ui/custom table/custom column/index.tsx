import { formatDates } from "@/app/(frontend)/types/functions";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../button";

type SortingColumnProps = {
    accessorKey: string;
    headerTitle: string;
    width?: string;
    value?: string;
    rowStyle?: string;
};

export const createSortingColumn = ({
    accessorKey,
    headerTitle,
    width = "w-[5%]",
    value,
    rowStyle = "",
}: SortingColumnProps) => ({
    accessorKey,
    header: ({ column }: { column: Column<any, unknown> }) => {
        const handleToggleSorting = () => {
            const currentSort = column.getIsSorted();

            if (!currentSort) {
                column.toggleSorting(true); // First click: set to descending
            } else if (currentSort === "desc") {
                column.toggleSorting(false); // Second click: switch to ascending
            } else {
                column.clearSorting(); // Third click: clear sorting
            }
        };

        return (
            <Button
                variant="ghost"
                onClick={handleToggleSorting}
                className="hover:bg-gray-100"
            >
                {headerTitle}
                <ArrowUpDown
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${column.getIsSorted() === "asc"
                        ? "rotate-180 text-blue-500"
                        : column.getIsSorted() === "desc"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                />
            </Button>
        );
    },
    cell: ({ row }: { row: any }) => {
        const cellValue = value && typeof row.getValue(accessorKey) === "object"
            ? row.getValue(accessorKey)[value]
            : row.getValue(accessorKey);

        const formattedValue = headerTitle.includes("Date")
            ? formatDates(cellValue)
            : typeof cellValue === "string"
                ? cellValue
                : String(cellValue);

        return (
            <div className={`${rowStyle} ml-4 ${width}`}>
                {formattedValue}
            </div>
        );
    },
});