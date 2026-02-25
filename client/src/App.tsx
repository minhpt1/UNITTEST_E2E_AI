import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              My Blog
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/blog" className="nav-link">
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create-post" className="nav-link">
                  Write Post
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-container">
            <p>&copy; 2026 My Blog. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
