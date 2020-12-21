import { Modal, Button } from 'antd';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ImageUpload from 'components/ImageUpload';

export default function UploadModal({ isAddAlbum }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      {isAddAlbum ? (
        <Button
          type='primary'
          danger
          shape='circle'
          icon={<PlusOutlined />}
          size='large'
          onClick={() => showModal(true)}
        />
      ) : (
        <CloudUploadOutlined
          style={{
            width: '32px',
            height: '32px',
            color: 'white',
            fontSize: '32px',
            cursor: 'pointer'
          }}
          onClick={() => showModal(true)}
        />
      )}
      <Modal
        title='Upload images'
        visible={isModalVisible}
        width='721px'
        height='500px'
        effect='fadeInUp'
        footer={null}
        onCancel={() => handleCancel()}
        onClickAway={() => handleCancel()}
      >
        <ImageUpload close={() => handleCancel()} isUpload={true} />
      </Modal>
    </div>
  );
}
