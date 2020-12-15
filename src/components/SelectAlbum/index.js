import { Select, Input } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db, updateAlbums, selectDB } from 'firebaseConfig';

export default function SelectAlbum({ setcurrentAlbum }) {
  const { Option } = Select;
  const currentUser = useSelector((state) => state.currentUser);
  const [album, setAlbum] = useState('');
  const [albums, setAlbums] = useState([]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setcurrentAlbum(value);
    setAlbum(value);
  };

  const updateA = async () => {
    let result = await selectDB('users', currentUser.uid);
    setAlbums(result.albums);
  };

  useEffect(() => {
    const updateA = async () => {
      let result = await selectDB('users', currentUser.uid);
      setAlbums(result.albums);
    };
    updateA();
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    await db
      .collection('albums')
      .add({
        name: album,
        photo: []
      })
      .then(async function (docRef) {
        console.log('Document written with ID: ', docRef.id);
        await updateAlbums('users', currentUser.uid, {
          value: docRef.id,
          label: album
        });
        await updateA();
        await setcurrentAlbum(docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding document: ', error);
      });
    setIsModalVisible(false);
  };

  return (
    <div>
      <Select
        showSearch
        value={album}
        style={{ width: 170 }}
        placeholder='Select a person'
        optionFilterProp='children'
        onChange={onChange}
      >
        <Option>
          <div onClick={showModal}>
            <PlusCircleTwoTone
              twoToneColor='#ff0000'
              style={{ paddingRight: '5px' }}
            />
            Create new Album
          </div>
        </Option>
        {albums
          ? albums.map((a, index) => (
              <Option key={index} value={a.value}>
                {a.label}
              </Option>
            ))
          : ''}
      </Select>

      <Modal
        title='Create New Album'
        visible={isModalVisible}
        effect='fadeInUp'
        onCancel={() => handleCancel()}
        onOk={handleOk}
        onClickAway={() => handleCancel()}
      >
        <Input
          placeholder='Album'
          onChange={(e) => setAlbum(e.target.value)}
          value={album}
        />
      </Modal>
    </div>
  );
}
