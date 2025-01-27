import { Order } from "@/app/(frontend)/types/interfaces";



const Invoice = ({ bill }: { bill: Order }) => {
    const totalBeforeDiscount = bill.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="p-8 border rounded-md shadow-md max-w-3xl mx-auto">
            <header className="mb-6 text-center">
                <h1 className="text-2xl font-bold">Invoice</h1>
                <p className="text-gray-500">Order ID: {bill.orderId}</p>
            </header>

            <section className="mb-6">
                <h2 className="font-bold text-lg mb-2">Customer Details</h2>
                <div className="text-sm">
                    <p><strong>Name:</strong> {bill.customerName || "N/A"}</p>
                    <p><strong>Phone:</strong> {bill.phoneNumber || "N/A"}</p>
                    <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleString()}</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="font-bold text-lg mb-2">Items</h2>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Item</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2">Price (LKR)</th>
                            <th className="border border-gray-300 px-4 py-2">Total (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bill.items.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                <td className="border border-gray-300 px-4 py-2">LKR {item.price.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    LKR {(item.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mb-6">
                <h2 className="font-bold text-lg mb-2">Summary</h2>
                <div className="text-sm">
                    <p><strong>Subtotal:</strong> LKR {totalBeforeDiscount.toFixed(2)}</p>
                    <p><strong>Discount:</strong> -LKR {bill.discount.toFixed(2)}</p>
                    <p className="text-lg font-bold"><strong>Total:</strong> LKR {bill.amount.toFixed(2)}</p>
                </div>
            </section>

            <footer className="text-center text-sm text-gray-500 mt-6">
                <p>
                    <strong>Invoice URL:</strong>{" "}
                    <a href={bill.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Invoice
                    </a>
                </p>
                <p>Generated on {new Date(bill.updatedAt).toUTCString()}</p>
            </footer>
        </div>
    );
};

export default Invoice;
