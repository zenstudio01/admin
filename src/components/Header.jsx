export default function Header() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  return (
    <header className="bg-white shadow-sm">
      <div className="px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">
          Unit
        </h1>

        <div className="flex items-center gap-4">
          <img
            src="https://ui-avatars.com/api/?name=Property+Manager"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h4 className="font-semibold">{user?.user_name || "Admin User"}</h4>
            <p className="text-sm text-gray-500">{user?.role || "No role"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}