import { Link } from "react-router";

const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="flex flex-row justify-between items-center container mx-auto">
				<Link to="/">
					<p className="sm:text-2xl text-xl font-bold text-gradient hover:gradient-hover">
						HireLens
					</p>
				</Link>
				<Link to="/upload" className="primary-button w-fit font-semibold">
					Upload Resume
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
