import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {

  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New episodes of your favorite shows are available", time: "2 hours ago" },
    { id: 2, message: "Continue watching: Stranger Things", time: "1 day ago" },
    { id: 3, message: "New movies added to your list", time: "3 days ago" }
  ]);

  useEffect(()=>{
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current && navRef.current.classList.add('nav-dark')
      } else {
        navRef.current && navRef.current.classList.remove('nav-dark')
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  },[])

  const handleNavigation = (item) => {
    switch(item.toLowerCase()) {
      case 'home':
        navigate('/');
        break;
      case 'tv shows':
        navigate('/tv-shows');
        break;
      case 'movies':
        navigate('/movies');
        break;
      case 'new & popular':
        navigate('/new-popular');
        break;
      case 'my list':
        navigate('/my-list');
        break;
      case 'browse by languages':
        navigate('/languages');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
        <ul>
          {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List', 'Browse by Languages'].map((item, index) => (
            <li 
              key={index} 
              onClick={() => handleNavigation(item)}
              className={location.pathname === '/' && item === 'Home' ? 'active' : ''}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <img
            src={search_icon}
            alt=""
            className='icons'
            onClick={() => setShowSearch((v) => !v)}
          />
          {showSearch && (
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                  setShowSearch(false);
                  setSearchTerm("");
                }
              }}
              autoFocus
            />
          )}
        </div>
        <p>Children</p>
        <div className="navbar-notifications">
          <img 
            src={bell_icon} 
            alt="" 
            className='icons' 
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && (
            <div className="notifications-dropdown">
              <h3>Notifications</h3>
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <p>{notification.message}</p>
                  <span>{notification.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-profile">
          <img 
            src={profile_img} 
            alt="" 
            className='profile' 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          <img 
            src={caret_icon} 
            alt="" 
            className='caret' 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="dropdown">
              <p onClick={() => setShowProfileDropdown(false)}>Account</p>
              <p onClick={() => setShowProfileDropdown(false)}>Help Center</p>
              <p onClick={handleLogout}>Sign Out of Netflix</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
