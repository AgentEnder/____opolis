import "./style.css";
import "./tailwind.css";
import { withBaseUrl } from '../utils/baseUrl';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href={withBaseUrl("/")} className="text-xl font-bold">Opolis</a>
              <div className="flex space-x-4">
                <a href={withBaseUrl("/")} className="hover:bg-gray-700 px-3 py-2 rounded-md">Home</a>
                <a href={withBaseUrl("/about")} className="hover:bg-gray-700 px-3 py-2 rounded-md">About</a>
                <a href={withBaseUrl("/play")} className="hover:bg-gray-700 px-3 py-2 rounded-md">Play</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}