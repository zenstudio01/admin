export default function Header() {
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
            <h4 className="font-semibold">Property Manager</h4>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}