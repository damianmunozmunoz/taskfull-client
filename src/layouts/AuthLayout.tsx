import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
    return (
        <>
            <div className="bg-gray-800 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center w-[600px] mt-10">
                    <Logo />
                    <div className="p-10 rounded w-full">
                        <Outlet />
                    </div>
                </div>
            </div>

            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
