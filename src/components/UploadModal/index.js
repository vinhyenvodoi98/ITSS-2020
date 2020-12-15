import { Modal } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ImageUpload from 'components/ImageUpload';

export default function UploadModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
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
