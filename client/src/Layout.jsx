export default function Layout({ sidebarContent, mainContent }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white overflow-y-auto hidden md:block">
        <div className="p-4">
          {sidebarContent}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {mainContent}
      </main>
    </div>
  );
}
