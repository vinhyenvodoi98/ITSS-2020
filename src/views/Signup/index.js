import { useState, useEffect } from 'react';

import {
  auth,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter
} from 'firebaseConfig';
import { Redirect } from 'react-router-dom';

import {
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import { Button } from 'antd';

import 'antd/dist/antd.css';
import './index.css';

export default function Signup() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='signin__btn'>
      {currentUser ? (
        <Redirect to='/' />
      ) : (
        <div className='bt_group'>
          <Button
            size='middle'
            onClick={signInWithGoogle}
            icon={<GoogleOutlined />}
          >
            Sign In
          </Button>

          <Button
            size='middle'
            onClick={signInWithFacebook}
            icon={<FacebookOutlined />}
          >
            Sign In
          </Button>

          <Button
            size='middle'
            onClick={signInWithTwitter}
            icon={<TwitterOutlined />}
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
