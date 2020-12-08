import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select, Avatar, Tooltip, Button } from 'antd';
import { CloudUploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { auth, signOut } from 'firebaseConfig';
import Modal from 'react-awesome-modal';

import './index.css';
import ImageUpload from 'components/ImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentUsers,
  searchPictures,
  getPictures,
  getSearch
} from 'store/actions';
import SearhByImages from 'components/SearchByImages';

const { Option } = Select;

function Header() {
  const [visible, setvisible] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const search = useSelector((state) => state.search);
  const onSearch = async (value) => {
    console.log(value);
    if (value.length > 0) dispatch(searchPictures(value));
    else dispatch(getPictures());
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUser(authUser);
        dispatch(setCurrentUsers(authUser));
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
    dispatch(setCurrentUser(null));
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
              Khám phá
            </Link>
          </li>
          <li className='nav-item active'>
            <Link className='nav-link' to='/'>
              Tạo
            </Link>
          </li>
          <li className='nav-item active'>
            <Link className='nav-link' to='/'>
              Dùng pro
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
              <CloudUploadOutlined
                style={{
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  fontSize: '32px',
                  cursor: 'pointer'
                }}
                onClick={() => setvisible(true)}
              />
            </li>
            <li>
              <Avatar
                size={40}
                src={auth.currentUser ? auth.currentUser.photoURL : ''}
                style={{ marginLeft: '20px' }}
              ></Avatar>
            </li>
            <li className='nav-link'>{auth.currentUser.displayName}</li>
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
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link className='nav-link' to='/'>
                Đăng ký
              </Link>
            </li>
          </ul>
        )}
      </div>
      <Modal
        visible={visible}
        width='721px'
        height='500px'
        effect='fadeInUp'
        onClickAway={() => setvisible(false)}
      >
        <ImageUpload close={() => setvisible(false)} isUpload={true} />
      </Modal>
    </nav>
  );
}

export default Header;
