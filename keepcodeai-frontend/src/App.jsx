import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dogrulandi from './pages/Dogrulandi';
import Dashboard from './pages/Dashboard';
import Docs from './pages/Docs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Pricing from './pages/Pricing';
import PublicCode from './pages/PublicCode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
        <Route path="/auth/dogrulandi" element={<Dogrulandi />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-plan" element={<Navigate to="/dashboard" replace />} />
        <Route path="/upgrade-plan" element={<Navigate to="/dashboard" replace />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/public-code" element={<PublicCode />} />
      </Routes>
    </Router>
  );
}

export default App;
