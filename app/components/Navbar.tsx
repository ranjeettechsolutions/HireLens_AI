import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  return (
    <nav className="navbar">
      <div className="flex flex-row justify-between items-center container mx-auto">
        <Link to="/">
          <p className="sm:text-2xl text-xl font-bold text-gradient hover:gradient-hover">
            HireLens
          </p>
        </Link>

        <div className=" flex justify-center items-center gap-2">
          {/* Upload Resume */}
          <Link
            to="/upload"
            className="
              primary-button
              flex items-center gap-2
              px-4 py-2
            "
          >
            <FaUpload className="text-lg" />
            <span className="hidden lg:inline">Upload Resume</span>
          </Link>
          {/* Logout */}
          <button
            onClick={auth.signOut}
            className="
              group
              relative
              flex items-center gap-2
              rounded-lg
              border border-red-200
              bg-red-50
              px-4 py-2
              text-sm font-semibold
              text-red-600
              transition-all duration-200
              hover:bg-red-600 hover:text-white hover:border-red-600
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            "
          >
            <FaSignOutAlt className="text-lg" />
            <span className="hidden lg:inline">Logout</span>

            {/* subtle hover overlay */}
            <span
              className="
                absolute inset-0
                rounded-lg
                bg-red-600
                opacity-0
                transition-opacity duration-200
                group-hover:opacity-10
              "
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
