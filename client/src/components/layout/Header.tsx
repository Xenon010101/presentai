import { Link } from "wouter";

interface HeaderProps {
  title: string;
  description?: string;
  showNewButton?: boolean;
}

export default function Header({ title, description, showNewButton = false }: HeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      
      {showNewButton && (
        <div className="mt-4 lg:mt-0">
          <Link href="/upload">
            <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <i className="ri-add-line mr-2"></i>
              New Evaluation
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
