import { useParams, Link, Redirect } from 'react-router-dom';
import { Avatar, Tag, message, Button } from 'antd';
import {
  storage,
  selectDB,
  updateDB,
  searchDB,
  deleteDB
} from 'firebaseConfig';
import CommentA from 'components/Comment';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import Images from 'components/Images';
import Modal from 'antd/lib/modal/Modal';

export default function ImageDetail() {
  let { title, id } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  const [author, setAuthor] = useState();
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState();
  const [onHover, setOnHover] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteComp, setDeleteComp] = useState(false);

  useEffect(() => {
    const updatePhoto = async () => {
      var photo = await selectDB('pictures', id);
      setPhoto(photo);
      setAuthor(await selectDB('users', photo.author.uid));
    };
    updatePhoto();
  }, [setPhoto, id]);

  useEffect(() => {
    const relationPhoto = async () => {
      if (!!photo) {
        if (!!photo.label) setPhotos(await searchDB('pictures', photo.label));
      }
    };

    relationPhoto();
  }, [photo]);

  const setComment = async () => {
    setPhoto(await selectDB('pictures', id));
  };

  const download = async () => {
    if (!!currentUser) {
      var user = await selectDB('users', currentUser.uid);
      if (user.downloadTime < 1) {
        message.warning(
          'You have reached the download limit, please upgrade VIP to continue'
        );
      } else {
        var storageRef = storage.ref();

        storageRef
          .child(`images/${title}`)
          .getDownloadURL()
          .then(function (url) {
            fetch(url, {
              method: 'GET',
              headers: {}
            })
              .then((response) => {
                response.arrayBuffer().then(function (buffer) {
                  const url = window.URL.createObjectURL(new Blob([buffer]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', title); //or any other extension
                  document.body.appendChild(link);
                  link.click();
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(function (error) {
            // Handle any errors
            console.log(error);
          });
        updateDB('users', currentUser.uid, {
          downloadTime: user.downloadTime - 1
        });
      }
    } else {
      message.warning('You must to signin to download images');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await deleteDB('pictures', id);
    setIsModalVisible(false);
    setDeleteComp(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='detail_images'>
      {deleteComp ? <Redirect to='/' /> : <></>}
      <div
        className='box'
        style={{
          width: '80vw',
          height: '80vh',
          borderRadius: '10px',
          marginTop: '3vh'
        }}
      >
        {photo ? (
          <div style={{ display: 'flex', height: '100%' }}>
            <div
              style={{
                width: '70%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                style={{ position: 'relative', height: '100%' }}
                onMouseEnter={() => setOnHover(1)}
                onMouseLeave={() => {
                  setOnHover(0);
                }}
              >
                <img
                  onContextMenu={(e) => e.preventDefault()}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    objectFit: 'cover'
                  }}
                  {...photo}
                />
                {onHover === 1 ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      position: 'absolute',
                      bottom: '0',
                      padding: '1vw'
                    }}
                  >
                    {photo.author.uid === currentUser.uid ? (
                      <Button
                        type='primary'
                        danger
                        shape='circle'
                        size='large'
                        onClick={showModal}
                        style={{
                          marginRight: '15px',
                          backgroundColor: '#efefef',
                          borderColor: '#efefef'
                        }}
                      >
                        <DeleteOutlined style={{ color: 'black' }} />
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      type='primary'
                      danger
                      shape='circle'
                      size='large'
                      onClick={() => download()}
                    >
                      <DownloadOutlined />
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div style={{ margin: '2vh', width: '30%' }}>
              <div>
                <p>
                  <strong>Tag</strong>
                </p>
                <div style={{ maxHeight: '7vh', overflow: 'auto' }}>
                  {photo.label
                    ? photo.label.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))
                    : ''}
                </div>
              </div>

              <div>
                <p>
                  <strong>Author</strong>
                </p>
                <div style={{ display: 'flex' }}>
                  <Link to={`/user/${photo.author.uid}`}>
                    <Avatar
                      size={40}
                      src={author ? author.photoURL : ''}
                      style={{ marginRight: '20px' }}
                    ></Avatar>
                  </Link>

                  <p>
                    <strong>{author ? author.displayName : ''}</strong>
                  </p>
                </div>
              </div>
              <div>
                <p style={{ marginTop: '1vh', marginBottom: '0' }}>
                  <strong>Size : {photo.size} MB</strong>
                </p>
              </div>
              <CommentA
                doc={id}
                comment={photo.comment}
                setComment={setComment}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='relation'>
        <h1>Similar Picture</h1>
        {!!photos ? <Images photos={photos} /> : ''}
      </div>
      <Modal
        title='Are you sure you want to delete this picture ?'
        visible={isModalVisible}
        onCancel={handleCancel}
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
            onClick={handleCancel}
          >
            <strong>Cancel</strong>
          </Button>
          <Button
            type='primary'
            danger
            style={{ width: '100%', borderRadius: '15px' }}
            onClick={handleOk}
          >
            <strong>Delete</strong>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
