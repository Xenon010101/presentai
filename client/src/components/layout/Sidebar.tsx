import { Link, useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const sidebarClass = isOpen
    ? "fixed inset-0 z-50 flex md:hidden"
    : "hidden md:flex md:w-64 flex-col fixed inset-y-0 z-50";
    
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`${sidebarClass} bg-white border-r border-slate-200`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <div className="flex items-center">
              <div className="bg-primary-600 text-white p-1.5 rounded">
                <i className="ri-presentation-line text-xl"></i>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-slate-900">PresentAI</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 pt-4 px-4 space-y-1 overflow-y-auto scrollbar-hide">
            <Link href="/">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/") 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}>
                <i className="ri-dashboard-line mr-3 text-lg"></i>
                Dashboard
              </a>
            </Link>
            
            <Link href="/upload">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/upload") 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}>
                <i className="ri-upload-cloud-line mr-3 text-lg"></i>
                Upload Video
              </a>
            </Link>
            
            <Link href="/evaluations">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/evaluations") 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}>
                <i className="ri-history-line mr-3 text-lg"></i>
                Past Evaluations
              </a>
            </Link>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
                <i className="ri-user-line"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700">Guest User</p>
                <p className="text-xs text-slate-500">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
