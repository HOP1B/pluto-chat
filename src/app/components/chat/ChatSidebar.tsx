export const ChatSideBar = () => {
  return (
    <aside className="w-1/4 max-w-60 bg-neutral-800 p-4 flex flex-col border-r border-neutral-700">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Chat</span>
        <button className="p-2 bg-neutral-700 rounded hover:bg-neutral-600">
          +
        </button>
      </div>
      {/* Contact List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {["Alex", "Ace", "Ares", "Aerson", "GaussTricky", "Orgil"].map(
          (user, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600"
            >
              <div className="w-10 h-10 bg-neutral-500 rounded-full flex items-center justify-center text-lg ">
                {user.charAt(0)}
              </div>
              <span>{user}</span>
            </div>
          )
        )}
      </div>

      {/* Settings Button */}
      <button className="mt-4 p-2 bg-neutral-700 rounded hover:bg-neutral-600">
        Settings
      </button>
    </aside>
  );
};
