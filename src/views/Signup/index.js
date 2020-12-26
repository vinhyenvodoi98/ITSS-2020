import { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import {
  auth,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  selectDB,
  insertDB
} from 'firebaseConfig';
import { Redirect } from 'react-router-dom';

import {
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';

import 'antd/dist/antd.css';
import './index.css';

export default function Signup() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const addUser = async () => {
      if (!!currentUser) {
        var isExists = await selectDB('users', currentUser.uid);
        if (!isExists) {
          insertDB('users', currentUser.uid, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
            downloadTime: 10000
          });
        }
      }
    };
    addUser();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className='signin__btn'>
      {currentUser ? (
        <Redirect to='/' />
      ) : (
        <div
          className='box'
          style={{ height: '60vh', width: '50wh', padding: '25px' }}
        >
          <h1>Login</h1>
          <div style={{ height: '60%', marginTop: '10%' }}>
            <Form
              name='normal_login'
              className='login-form'
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name='username'
                rules={[
                  { required: true, message: 'Please input your Username!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='Username'
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[
                  { required: true, message: 'Please input your Password!' }
                ]}
              >
                <Input
                  prefix={<LockOutlined className='site-form-item-icon' />}
                  type='password'
                  placeholder='Password'
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className='login-form-forgot' href='/'>
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                  style={{ marginRight: '10px' }}
                >
                  Log in
                </Button>
                Or <a href='/'>register now!</a>
              </Form.Item>
            </Form>
          </div>
          <hr />
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
        </div>
      )}
    </div>
  );
}
