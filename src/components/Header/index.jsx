import React, { useEffect } from 'react';
import './style.css';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

import userImg from '../../assets/taji-3.jpg';

function Header() {
  const [user, loading] = useAuthState(auth);
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  function Logout() {
    try {
      signOut(auth)
        .then(() => {
          toast.success('User logged out');
          navigate('/');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='navbar'>
      <p className='logo'>WalletWise</p>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            alt="User Avatar"
            style={{ borderRadius: '50%', height: '2rem', width: '2rem' }}
          />
          <p onClick={Logout} className='logo link'>
            logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
