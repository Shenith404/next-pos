'use client'
import useProcessing from "@/app/(frontend)/hooks/useProcessing";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import Announcements from "@/components/ui/Announcements";
import AttendanceChart from "@/components/ui/AttendanceChart";
import CountChart from "@/components/ui/CountChart";
import EventCalendar from "@/components/ui/EventCalendar";
import FinanceChart from "@/components/ui/FinanceChart";
import LoadingAnimation from "@/components/ui/loading animation";
import UserCard from "@/components/ui/UserCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Stats {
    operatorCount: number,
    orderCount: number,
    productCount: number
}

const AdminPage = () => {

    const [stats, setStats] = useState<Stats | null>(null);
    const { processing, startProcessing, stopProcessing } = useProcessing();

    // get data
    useEffect(() => {
        const fetchData = async () => {
            startProcessing();
            try {
                const result: Stats = await apiService.get('/stat');
                setStats(result);
                console.log('stats', result);
            } catch (error) {
                console.log('error', error);
                toast.error('Failed to fetch data');
            }
            stopProcessing();
        }
        fetchData();
    }, [])

    return (
        <div>
            {processing ? <LoadingAnimation /> : <div className="p-4 flex gap-4 flex-col md:flex-row">
                {/* LEFT */}
                <div className="w-full lg:w-2/3 flex flex-col gap-8">
                    {/* USER CARDS */}
                    <div className="flex gap-4 justify-between flex-wrap">
                        <UserCard count={stats?.operatorCount ?? 0} type="operator" />
                        <UserCard count={stats?.orderCount ?? 0} type="order" />
                        <UserCard count={stats?.productCount ?? 0} type="product" />
                    </div>
                    {/* MIDDLE CHARTS */}
                    <div className="flex gap-4 flex-col lg:flex-row">
                        {/* COUNT CHART */}
                        <div className="w-full lg:w-1/3 h-[450px]">
                            <CountChart />
                        </div>
                        {/* ATTENDANCE CHART */}
                        <div className="w-full lg:w-2/3 h-[450px]">
                            <AttendanceChart />
                        </div>
                    </div>
                    {/* BOTTOM CHART */}
                    <div className="w-full h-[500px]">
                        <FinanceChart />
                    </div>
                </div>
                {/* RIGHT */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8">
                    <EventCalendar />
                    <Announcements />
                </div>
            </div>}
        </div>
    );
};

export default AdminPage;
