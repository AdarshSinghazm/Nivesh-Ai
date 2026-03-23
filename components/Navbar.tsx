import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                InvestAI
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link href="/market" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Market</Link>
              <Link href="/analyzer" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">AI Assistant</Link>


              <div className="h-4 w-px bg-gray-700 mx-2"></div>

              <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
