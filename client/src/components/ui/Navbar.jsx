import React, { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import SearchBar from "../searchbar";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    // Yahan aap token clear karo ya logout API call
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white border-b shadow flex items-center justify-between px-6">
      {/* Left: Search bar */}
       <div className="flex justify-between items-center  shadow-md">
      {/* Left - Search */}
      <SearchBar placeholder="Search anything..." onChange={(e) => console.log(e.target.value)} />
        </div>

      {/* Right: User Dropdown */}
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300">
            <span className="font-medium text-gray-700">Admin</span>
            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${active ? "bg-gray-100" : ""
                        } w-full text-left px-4 py-2 text-sm text-red-600`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
