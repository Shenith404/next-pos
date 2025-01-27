'use client';
import MyDialog from "@/components/ui/custom dialog";
import { Download, StopCircle } from "lucide-react";
import SalesForm from "./salesForm";
import StockFrom from "./stockFrom";

const Reports = () => {

    return (
        <div className="flex justify-center items-center w-full h-screen  relative">
            <div className="flex w-[75%] h-[50%] justify-center ">
                <MyDialog btnSize="default"
                    btnVaraient="default"
                    btnName={<div className="items-center">
                        <h1 className="text-3xl">Current Stock Report</h1>
                        <div className="w-full flex justify-center mt-4">
                            <Download size={64} className="text-9xl font-semibold" />
                            <StopCircle className="text-9xl ml-4" />
                        </div>
                    </div>}


                    dialogTitle={'Edit Product'}
                    dialogDescription={""}
                    dialogWidth="w-[1000px]"
                    btnStyle="w-[45%] h-[60%] border-[2px]  z-1 shadow-xl  bg-primary rounded-xl hover:bg-secondary text-2xl font-semibold text-white grid place-items-center"
                    formElements={<StockFrom />}
                />
                <MyDialog btnSize="default"
                    btnVaraient="default"
                    btnName={<div className="items-center">
                        <h1 className="text-3xl">Sales Report </h1>
                        <div className="w-full flex justify-center mt-4">
                            <Download size={64} className="text-9xl font-semibold" />
                            <StopCircle className="text-9xl ml-4" />
                        </div>
                    </div>}


                    dialogTitle={'Edit Product'}
                    dialogDescription={""}
                    dialogWidth="w-[1000px]"
                    btnStyle="w-[45%] h-[60%] border-[2px]  z-1 shadow-xl  bg-primary rounded-xl hover:bg-secondary text-2xl font-semibold text-white grid place-items-center"
                    formElements={<SalesForm />}
                />
            </div>
        </div>
    )
}

export default Reports