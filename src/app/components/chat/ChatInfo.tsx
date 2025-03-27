export const ChatInfo = () => {
  return (
    <aside className="w-64 bg-neutral-800 border-l border-neutral-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Group Info</h3>
      </div>
      <div className="text-sm text-neutral-400 mb-4">
        <p>Files: 265 Photos</p>
      </div>
      <div className="text-sm text-neutral-400">
        <p>5 Members</p>
      </div>
    </aside>
  );
};
