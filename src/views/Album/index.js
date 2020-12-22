import { useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { selectDB } from 'firebaseConfig';
import { EllipsisOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import TextArea from 'antd/lib/input/TextArea';
import { useSelector } from 'react-redux';

function Images({ photo }) {
  return (
    <Col
      onContextMenu={(e) => e.preventDefault()}
      id='my_image'
      className='gutter-row'
      span={6}
      style={{ height: '60vh' }}
    >
      <Row
        justify='center'
        style={{
          borderRadius: '20px',
          margin: '0px 10px',
          cursor: 'pointer',
          height: '100%'
        }}
      >
        <Link to={`/images/${photo.title}/${photo.id}`}>
          <img
            src={photo.src}
            alt=''
            style={{
              height: '100%',
              width: '100%',
              borderRadius: '20px',
              objectFit: 'cover'
            }}
          />
        </Link>
      </Row>
    </Col>
  );
}

export default function Album() {
  let { id } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  const [photos, setPhotos] = useState([]);
  const [albumName, setAlbumName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      var albums = await selectDB('albums', id);
      setAlbumName(albums.name);
      await albums.photo.forEach(async (b) => {
        var photo = await selectDB('pictures', b);
        photo.id = b;
        setPhotos((photos) => [...photos, photo]);
      });
    };
    fetchPhoto();
  }, [id]);

  return (
    <div className='detail_images' style={{ padding: '3vw' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
      >
        <h1 style={{ marginBottom: 0, marginRight: '15px' }}> {albumName}</h1>
        {currentUser.albums.some((album) => album.value === id) ? (
          <Button
            type='primary'
            style={{ backgroundColor: '#efefef', borderColor: '#efefef' }}
            shape='circle'
            icon={
              <EllipsisOutlined style={{ fontSize: '28px', color: 'black' }} />
            }
            size='large'
            onClick={showModal}
          />
        ) : (
          <></>
        )}
      </div>
      <Row gutter={[16, 24]}>
        {!!photos ? (
          photos.map((photo, index) => <Images key={index} photo={photo} />)
        ) : (
          <p>Loading</p>
        )}
      </Row>
      <Modal
        title='Update Album'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h5 style={{ marginBottom: 0 }}>Name</h5>
        <Input style={{ marginBottom: '15px' }} placeholder={albumName} />
        <h5 style={{ marginBottom: 0 }}>Description</h5>
        <TextArea
          placeholder='Some thing amazing'
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Modal>
    </div>
  );
}
