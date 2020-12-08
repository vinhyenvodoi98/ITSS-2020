import { Modal, Button } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ImageUpload from 'components/ImageUpload';

export default function SearhByImages() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button
        className='detail_images'
        style={{
          marginRight: 20,
          width: '35px',
          borderRadius: '0px 2px 2px 0px'
        }}
        onClick={showModal}
      >
        <CameraOutlined style={{ fontSize: '21px', color: '#767676' }} />
      </Button>
      <Modal
        title='Search by images'
        visible={isModalVisible}
        width='721px'
        height='500px'
        effect='fadeInUp'
        footer={null}
        onCancel={() => handleCancel()}
        onClickAway={() => handleCancel()}
      >
        <ImageUpload close={() => handleCancel()} isUpload={false} />
      </Modal>
    </div>
  );
}
