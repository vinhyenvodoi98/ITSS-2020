import { useParams, Link, Redirect } from 'react-router-dom';
import { Row, Col, Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { selectDB, updateDB, deleteDB } from 'firebaseConfig';
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
  const [isModalSureVisible, setIsModalSureVisible] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [routerTo, setRouterTo] = useState();

  const showModalSure = () => {
    setIsModalSureVisible(true);
  };

  const handleOkSure = async () => {
    photos.forEach((photo) => deleteDB('pictures', photo.id));
    await deleteDB('albums', id);
    let index = currentUser.albums.findIndex((i) => i.value === id);
    currentUser.albums.splice(index, 1);
    await updateDB('users', currentUser.uid, currentUser);
    setRouterTo('user');
    setIsModalSureVisible(false);
    setIsModalVisible(false);
  };

  const handleCancelSure = () => {
    setIsModalSureVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await updateDB('albums', id, { name: newAlbumName });
    let index = currentUser.albums.findIndex((i) => i.value === id);
    currentUser.albums[index].label = newAlbumName;
    await updateDB('users', currentUser.uid, currentUser);
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
        if (!!photo) {
          photo.id = b;
          setPhotos((photos) => [...photos, photo]);
        }
      });
    };
    fetchPhoto();
  }, [id]);

  return (
    <div className='detail_images' style={{ padding: '3vw' }}>
      {!!routerTo ? <Redirect to={`/user/${currentUser.uid}`} /> : <></>}
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
      >
        <h1 style={{ marginBottom: 0, marginRight: '15px' }}> {albumName}</h1>
        {!!currentUser &&
        currentUser.albums.some((album) => album.value === id) ? (
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
        onCancel={handleCancel}
        footer={[
          <Button type='primary' danger key='2' onClick={showModalSure}>
            Delete
          </Button>,
          <Button type='primary' key='1' onClick={handleOk}>
            OK
          </Button>
        ]}
      >
        <h5 style={{ marginBottom: 0 }}>Name</h5>
        <Input
          style={{ marginBottom: '15px' }}
          placeholder={albumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <h5 style={{ marginBottom: 0 }}>Description</h5>
        <TextArea
          placeholder='Some thing amazing'
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Modal>

      <Modal
        title='Are you sure you want to delete this album ?'
        visible={isModalSureVisible}
        onCancel={handleCancelSure}
        footer={[]}
      >
        <div style={{ width: '100%' }}>
          <Button
            type='primary'
            style={{
              width: '100%',
              backgroundColor: '#efefef',
              borderColor: '#efefef',
              borderRadius: '15px',
              marginBottom: '15px',
              color: 'black'
            }}
            onClick={handleCancelSure}
          >
            <strong>Cancel</strong>
          </Button>
          <Button
            type='primary'
            danger
            style={{ width: '100%', borderRadius: '15px' }}
            onClick={handleOkSure}
          >
            <strong>Delete</strong>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
