import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, logout, role }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Task Manager
        </Link>

        {isAuthenticated && (
          <ul className="navbar-nav ms-auto">
            {/* Member Links */}
            {role === "Member" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/MemberProject">
                    Projects
                  </Link>
                </li>
              </>
            )}

            {/* Manager Links */}
            {role === "Team Lead" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/ManagerDashboard">
                    Manager Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ManagerProject">
                    Manager Projects
                  </Link>
                </li>
              </>
            )}

            {/* Admin Links */}
            {role === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/AdminDashboard">
                  Admin Dashboard
                </Link>
              </li>
            )}

            {/* Logout Button */}
            <li className="nav-item">
              <button className="btn btn-outline-light ms-3" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        )}

        {!isAuthenticated && (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Login
              </Link>
            </li>
            
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

