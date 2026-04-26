import { Route, Routes, Link, NavLink } from 'react-router-dom';
import { BookingsPage } from '../pages/BookingsPage';
import { FlightsPage } from '../pages/FlightsPage';

export function App() {
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
        <Routes>
          <Route path="/" element={<BookingsPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="*" element={<div className="page"><h1>Not Found</h1><Link to="/">Go home</Link></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
