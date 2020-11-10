import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import Modal from 'react-awesome-modal';

import './index.css';
import ImageUpload from 'components/ImageUpload';
const { Search } = Input;

function Header() {
  const [visible, setvisible] = useState(false);
  const onSearch = (value) => console.log(value);

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
        <Search
          placeholder='input search text'
          allowClear
          onSearch={onSearch}
          style={{ width: 200, margin: '0 10px' }}
        />
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
            <Link className='nav-link' to='/'>
              Đăng nhập
            </Link>
          </li>
          <li>
            <Link className='nav-link' to='/'>
              Đăng ký
            </Link>
          </li>
        </ul>
      </div>
      <Modal
        visible={visible}
        width='721px'
        height='500px'
        effect='fadeInUp'
        onClickAway={() => setvisible(false)}
      >
        <ImageUpload close={() => setvisible(false)} />
      </Modal>
    </nav>
  );
}

export default Header;
