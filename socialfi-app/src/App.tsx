import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import PublicProfile from './pages/PublicProfile';
import CreatePost from './pages/CreatePost';
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
          <Route path="home" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="/:username/following" element={<FollowingList />} />
          <Route path="/:username/followers" element={<FollowersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;