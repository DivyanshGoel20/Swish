import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import FollowingList from './pages/FollowingList';
import FollowersList from './pages/FollowersList';
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="/:username/following" element={<FollowingList />} />
          <Route path="/:username/followers" element={<FollowersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;