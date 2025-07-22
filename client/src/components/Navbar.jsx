import { useAuth } from "../hooks/useAuth";

export default function Navbar({ toggleSidebar }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <button onClick={toggleSidebar} className="lg:hidden text-gray-600">
        ☰
      </button>
      <div className="text-xl font-bold">Admin Panel</div>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}