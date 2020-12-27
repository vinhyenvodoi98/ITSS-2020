import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select, Avatar, Tooltip, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { auth, signOut, selectDB } from 'firebaseConfig';

import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentUsers,
  searchPictures,
  getPictures,
  getSearch
} from 'store/actions';
import SearhByImages from 'components/SearchByImages';
import UploadModal from 'components/UploadModal';

const { Option } = Select;

function Header() {
  const [currentUser, setCurrentUser] = useState('');
  const search = useSelector((state) => state.search);
  const currentUserT = useSelector((state) => state.currentUser);
  const onSearch = async (value) => {
    if (value.length > 0) dispatch(searchPictures(value));
    else dispatch(getPictures());
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        let user = await selectDB('users', authUser.uid);
        setCurrentUser(user);
        dispatch(setCurrentUsers(user));
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSearch());
  }, [dispatch]);

  const signout = () => {
    signOut();
    setCurrentUser('');
    dispatch(setCurrentUsers(null));
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <Link className='navbar-brand' to='/'>
        Cloud Light
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item active'>
            <Link className='nav-link' to='/'>
              Discover
            </Link>
          </li>
          {/* <li className='nav-item active'>
            <Link className='nav-link' to='/'>
              Tạo
            </Link>
          </li> */}
          <li className='nav-item active'>
            <Link className='nav-link' to='/credit'>
              Go Pro
            </Link>
          </li>
        </ul>
        <Select
          mode='multiple'
          style={{ width: 400, borderRadius: '2px 0px 0px 2px !important' }}
          placeholder='Search images'
          optionFilterProp='children'
          onChange={onSearch}
        >
          {search.map((d, index) => (
            <Option key={index} value={d}>
              {d}
            </Option>
          ))}
        </Select>
        <SearhByImages />
        {!!currentUser ? (
          <ul className='navbar-nav'>
            <li>
              <UploadModal />
            </li>
            <li>
              <Link to={`/user/${currentUser.uid}`}>
                <Avatar
                  size={40}
                  src={currentUserT ? currentUserT.photoURL : ''}
                  style={{ marginLeft: '20px' }}
                ></Avatar>
              </Link>
            </li>
            <Link to={`/user/${currentUser.uid}`}>
              <li className='nav-link'>
                {currentUserT ? currentUserT.displayName : ''}
              </li>
            </Link>

            <li>
              <Tooltip placement='topLeft' title='Logout'>
                <Button
                  size='small'
                  icon={<LogoutOutlined />}
                  onClick={() => signout()}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    marginTop: '7px'
                  }}
                ></Button>
              </Tooltip>
            </li>
          </ul>
        ) : (
          <ul className='navbar-nav'>
            <li>
              <Link className='nav-link' to='/signup'>
                SignIn
              </Link>
            </li>
            <li>
              <Link className='nav-link' to='/'>
                SignUp
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
