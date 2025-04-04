import { Link } from "wouter";

interface HeaderProps {
  title: string;
  description?: string;
  showNewButton?: boolean;
}

export default function Header({ title, description, showNewButton = false }: HeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
      <div className="animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-slate-600 text-lg max-w-2xl mt-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            {description}
          </p>
        )}
      </div>
      
      {showNewButton && (
        <div className="mt-6 lg:mt-0 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <Link href="/upload" className="btn-primary inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium transition-all">
            <i className="ri-add-line mr-2 text-lg"></i>
            New Evaluation
          </Link>
        </div>
      )}
    </div>
  );
}
