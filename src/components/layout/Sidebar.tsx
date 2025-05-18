
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, BarChart2, Settings, Plus } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { label: "Dashboard", icon: <BookOpen size={20} className="text-neuro-purple" />, path: "/" },
    { label: "Statistics", icon: <BarChart2 size={20} className="text-neuro-purple" />, path: "/stats" },
    { label: "Settings", icon: <Settings size={20} className="text-neuro-purple" />, path: "/settings" },
  ];

  return (
    <aside
      className={`glass fixed md:relative z-20 h-screen md:min-h-screen transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 md:w-20"
      } overflow-hidden`}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-neuro-purple to-neuro-light-purple text-white text-xl font-bold shadow-lg hover:shadow-neuro-purple/50 transition-all duration-300 hover:scale-110">
            NS
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label} className="overflow-hidden">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-300 
                    ${isActive
                      ? "bg-neuro-purple text-white shadow-md shadow-neuro-purple/30"
                      : "hover:bg-accent hover:text-neuro-purple"
                    }
                    ${isOpen ? "" : "justify-center"}
                    hover:scale-105`
                  }
                  onClick={() => onClose()}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={`${isOpen ? "opacity-100" : "opacity-0 md:hidden"} transition-opacity duration-300 whitespace-nowrap`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-4 pb-2">
          <button
            className={`w-full flex items-center ${isOpen ? "justify-start" : "justify-center"} p-3 rounded-lg bg-gradient-to-r from-neuro-purple to-neuro-light-purple text-white hover:shadow-lg hover:shadow-neuro-purple/30 transition-all duration-300 hover:scale-105`}
            onClick={() => {
              navigate("/");
              onClose();
            }}
          >
            <Plus size={20} className={`${isOpen ? "mr-3" : "mr-0"}`} />
            <span className={`${isOpen ? "opacity-100" : "opacity-0 md:hidden"} transition-opacity duration-300`}>
              New Deck
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
