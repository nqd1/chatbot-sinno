import { FC, useState } from "react";
import Image from "next/image";
import { Sun, Moon, Bell } from "lucide-react";

export const Navbar: FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className={`border-b border-neutral-200 ${darkMode ? "bg-gray-900" : "bg-[#b01c2c]"}`}>
      <div className="max-w-[800px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
            <Image src="/logo.png" alt="Sinno Logo" width={32} height={32} className="p-1" />
          </div>
          <a 
            href="https://www.facebook.com/SINNOclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-[#FFF5F5] hover:text-neutral-200 transition-colors"
          >
            Chatbot Sinno
          </a>
        </div>

        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          className="px-3 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-gray-500"
        />

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-white hover:underline">Home</a>
          <a href="#" className="text-white hover:underline">About</a>
          <a href="#" className="text-white hover:underline">Contact</a>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <Bell className="text-white cursor-pointer" size={24} />
          
          {/* Dark Mode Toggle */}
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="text-white" size={24} /> : <Moon className="text-white" size={24} />}
          </button>
        </div>
      </div>
      
      {/* Development Notice */}
      <div className="text-center text-sm py-1 bg-gray-700 text-white">
        🚀 Đang phát triển thêm tính năng mới! 
        Chi tiết các project khác của SINNO xem <a href="https://github.com/SOICTInnovationClub" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 underline">
            tại đây!
        </a>
      </div>
    </nav>
  );
};
