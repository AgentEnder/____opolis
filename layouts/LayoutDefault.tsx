import "./style.css";
import "./tailwind.css";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-xl font-bold">Opolis</a>
              <div className="flex space-x-4">
                <a href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">Home</a>
                <a href="/about" className="hover:bg-gray-700 px-3 py-2 rounded-md">About</a>
                <a href="/play" className="hover:bg-gray-700 px-3 py-2 rounded-md">Play</a>
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