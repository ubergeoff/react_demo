import { Route, Routes, Link } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { BookingsPage } from '../pages/BookingsPage';
import { FlightsPage } from '../pages/FlightsPage';

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<BookingsPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="*" element={<div className="page"><h1>Not Found</h1><Link to="/">Go home</Link></div>} />
      </Route>
    </Routes>
  );
}

export default App;
