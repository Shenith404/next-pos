
import useFetch from "@/app/(frontend)/hooks/useFetch";
import useForm from "@/app/(frontend)/hooks/useForm";
import { Order } from "@/app/(frontend)/types/interfaces";
import { posSearchSchema } from "@/app/(frontend)/utils/validations";
import CustomInput from "@/components/ui/input";
import { useCallback, useMemo } from "react";



type SearchOldOrderProps = {
    selected: Order | null;
    setSelected: (order: Order) => void;
    resetFunctions: () => void;
};

const SearchOldOrder = ({ selected, setSelected, resetFunctions }: SearchOldOrderProps) => {
    const { values, handleChange } = useForm(
        { searchTerm: '', category: '' },
        posSearchSchema
    );


    const { data } = useFetch<Order[]>('order/not-returned');


    // Memoized filtered orders based on search key and selected order
    const filteredOrders = useMemo(() => {
        if (!values.searchTerm) return [];
        return data?.filter((data: any) =>
            data.orderId.includes(values.searchTerm) &&
            data.orderId !== selected?.orderId
        )
            ;
    }, [values.searchTerm, data, selected]);

    // Select order handler, moved outside render loop
    const handleSelectOrder = useCallback((order: Order) => {
        setSelected(order);
        resetFunctions();
        // Assuming handleChange is meant to handle events, directly set the searchTerm value instead
        // If useForm provides a setter, use that. Otherwise, you may need to adjust useForm accordingly.
        handleChange({ target: { name: 'searchTerm', value: order.orderId } } as React.ChangeEvent<HTMLInputElement>);
    }, [handleChange]);



    return (
        <div className="px-5 relative h-16 mt-3">
            {/* Search results dropdown */}
            {values.searchTerm && (
                <div className="bg-gray-50 absolute w-[380px] top-20 left-[20px] z-40 p-2 max-h-[400px] overflow-y-auto">
                    {filteredOrders?.map(order => (
                        <button
                            key={order._id}
                            onClick={() => handleSelectOrder(order)}
                            className="flex bg-gray-100 rounded-lg m-1 w-full justify-between items-center p-2 border-b border-gray-400"
                        >
                            <div>{order.orderId}</div>
                            <div>{formatDate(order.createdAt)}</div>
                        </button>
                    ))}
                </div>
            )}

            <CustomInput
                label="Get Old Order"
                name="searchTerm"
                placeholder="Search Order Id Here..."
                value={values.searchTerm}
                onchange={handleChange} type="string" />
        </div>
    );
};

export default SearchOldOrder;

const formatDate = (isoString: string) => {
    const [date, time] = isoString.split("T");
    const formattedTime = time.split(".")[0]; // Remove milliseconds if present
    return `${date} ${formattedTime}`;
};