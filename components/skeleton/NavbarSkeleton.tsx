export default function NavbarSkeleton() {
  return (
    <nav
      className="w-full z-[9999] md:px-10 lg:px-16 transition-all duration-300 flex justify-between items-center px-8 
      fixed   bg-white/80 shadow-lg backdrop-blur-md py-4"
    >
      <div className="text-xl flex items-center gap-3">
        <div className="mr-6">
          <a
            href="/"
            className="text-gray-800 text-2xl text-shadow-lg text-shadow-red-500 font-bold"
          >
            Logo
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-4"></div>
    </nav>
  );
}
