import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isPassenger, isDriver, isAdmin } =
    useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-car me-2"></i>
          RideShare
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>

            {isAuthenticated && (
              <>
                {isPassenger && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/passenger/dashboard">
                        <i className="fas fa-tachometer-alt me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/passenger/request-ride">
                        <i className="fas fa-plus-circle me-1"></i>
                        Request Ride
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/passenger/my-rides">
                        <i className="fas fa-list me-1"></i>
                        My Rides
                      </Link>
                    </li>
                  </>
                )}

                {isDriver && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/driver/dashboard">
                        <i className="fas fa-tachometer-alt me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/driver/available-rides">
                        <i className="fas fa-search me-1"></i>
                        Find Rides
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/driver/my-rides">
                        <i className="fas fa-car me-1"></i>
                        My Rides
                      </Link>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">
                        <i className="fas fa-chart-bar me-1"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">
                        <i className="fas fa-users me-1"></i>
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/rides">
                        <i className="fas fa-car me-1"></i>
                        Manage Rides
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user?.name}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/debug">
                    <i className="fas fa-bug me-1"></i>
                    Debug
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light ms-2" to="/register">
                    <i className="fas fa-user-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
