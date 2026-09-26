import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>🏠</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>📅</span>
          Calendar
        </NavLink>

        <NavLink
          to="/timeline"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>🕒</span>
          Timeline
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>🔎</span>
          Search
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>⭐</span>
          Favorites
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span>⚙️</span>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;