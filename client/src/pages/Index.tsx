import { Link } from "react-router-dom";
import { useSession } from "../components/utility/useSession";

const Index = () => {

  useSession();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-center bg-blue-100 gap-4">
      <h1 className="text-5xl font-bold text-blue-800 animate-bounce">
        Welcome to IHaveGPU
      </h1>
      <p className="text-xl text-blue-700 animate-pulse">
        POWER UP YOUR PC, POWER UP YOUR LIFE!!!
      </p>

      <Link
        to="/login"
        className="px-6 py-3 bg-blue-700 text-white rounded shadow-2xl hover:bg-blue-800 cursor-pointer transition"
      >
        Login
      </Link>

      <p className="mt-3">
        Don't have an account yet?{" "}
        <Link
          to="/register"
          className="text-blue-700 underline cursor-pointer"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Index;
