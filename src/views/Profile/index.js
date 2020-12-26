import { Avatar, Input, Button, Upload } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  selectDB,
  selectPictureFromAuthor,
  updateDB,
  storage
} from 'firebaseConfig';
import ViewTab from 'components/ViewTab';
import Modal from 'antd/lib/modal/Modal';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default function Profile() {
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState();
  const [gmail, setGmail] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!!imageFile) {
      //////////////////
      //////////////////
      var uploadTask = storage.ref(`images/${imageFile.name}`).put(imageFile);
      uploadTask.on(
        'state_changed',
        function (snapshot) {},
        function (error) {
          // Handle unsuccessful uploads
          console.log(error);
        },
        function () {
          storage
            .ref('images')
            .child(imageFile.name)
            .getDownloadURL()
            .then(async (url) => {
              console.log(url);
              await updateDB('users', user.uid, {
                photoURL: url,
                displayName: name,
                email: gmail
              });
            });
        }
      );
      //////////////////
      //////////////////
    } else
      await updateDB('users', user.uid, { displayName: name, email: gmail });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      var user = await selectDB('users', id);
      setUser(user);
      setName(user.displayName);
      setGmail(user.email);
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const getPhoto = async () => {
      setPhotos(await selectPictureFromAuthor('pictures', id));
    };
    getPhoto();
  }, [id]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    setImageFile(info.file.originFileObj);
    console.log(info.file.originFileObj);
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };

  return (
    <>
      {user ? (
        <div className='detail_images' style={{ marginTop: '5vh' }}>
          <Avatar size={180} src={user.photoURL}></Avatar>

          {!!currentUser && id === currentUser.uid ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
              >
                <h1 style={{ marginBottom: 0, marginRight: '15px' }}>
                  {user.displayName}
                </h1>
                <Button
                  type='primary'
                  style={{
                    backgroundColor: '#efefef',
                    borderColor: '#efefef'
                  }}
                  shape='circle'
                  icon={
                    <EditOutlined
                      style={{ fontSize: '28px', color: 'black' }}
                    />
                  }
                  size='large'
                  onClick={showModal}
                />
              </div>
              <p>{user.email}</p>
              <p>
                You have : <strong>{user.downloadTime}</strong> download time
              </p>
              <Modal
                title='Update Profile'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <h5>Upload Avatar</h5>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                  // beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt='avatar'
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                <h5 style={{ marginBottom: 0 }}>Name</h5>
                <Input
                  style={{ marginBottom: '15px' }}
                  placeholder={user.displayName}
                  onChange={(e) => setName(e.target.value)}
                />
                <h5 style={{ marginBottom: 0 }}>Gmail</h5>
                <Input
                  style={{ marginBottom: '15px' }}
                  placeholder={user.email}
                  onChange={(e) => setGmail(e.target.value)}
                />
              </Modal>
            </>
          ) : (
            <>
              <h1>{user.displayName}</h1>
              <p>{user.email}</p>
            </>
          )}
          <ViewTab photos={photos} user={user} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
