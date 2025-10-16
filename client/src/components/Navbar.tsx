const Navbar = () => {
  return (
     <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h2 className="text-xl font-bold text-blue-700">IHaveGPU</h2>
      <div className="space-x-4">
        <a href="#" className="text-blue-700 hover:text-blue-900">Home</a>
        <a href="#" className="text-blue-700 hover:text-blue-900">About</a>
        <a href="#" className="text-blue-700 hover:text-blue-900">Contact</a>
      </div>
    </nav>
  )
}
export default Navbar