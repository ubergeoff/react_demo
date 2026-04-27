import { Outlet, NavLink } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="plane-icon">✈</span>
          <span className="brand-name">SkyBook</span>
        </div>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Bookings
          </NavLink>
          <NavLink to="/flights" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Flights
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
