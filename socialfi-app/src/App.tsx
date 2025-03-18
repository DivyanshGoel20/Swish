import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Layout from './components/Layout';
import WalletConnect from './components/WalletConnect';
import CreateProfile from './components/CreateProfile';
import NetworkEnforcer from './components/NetworkEnforcer';

function App() {
  return (
    <BrowserRouter>
      <NetworkEnforcer />
      <Routes>
        <Route path="/" element={<WalletConnect />} />
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="create-profile" element={<CreateProfile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/:username" element={<PublicProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;