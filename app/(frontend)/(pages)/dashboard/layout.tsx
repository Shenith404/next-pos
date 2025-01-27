
import Header from "@/components/ui/header/header";
import SideBar from "@/components/ui/sideBar/sidebar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="h-screen w-full flex">
            {/* LEFT */}
            <div className="w-[14%] bg-primary/100 md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
                <Link
                    href="/"
                    className="flex items-center justify-center lg:justify-start gap-2"
                >
                    <Image src="/logo.png" alt="logo" width={32} height={32} />
                    <span className="hidden lg:block  text-gray-50 font-bold">Dashboard</span>
                </Link>
                <SideBar />
            </div>
            {/* RIGHT */}
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col ">
                <Header />
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
