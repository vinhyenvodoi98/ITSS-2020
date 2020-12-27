import Modal from 'antd/lib/modal/Modal';
import { Button, message } from 'antd';
import { useState } from 'react';

function Package({ name, des, money, time }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    message.success('Buy successfully !!!');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div
        className='detail_images box'
        style={{
          padding: '30px',
          width: '250px',
          height: '320px',
          borderRadius: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={showModal}
      >
        <h2>{name}</h2>
        <p style={{ height: '60%' }}>{des}</p>
        <p>
          <strong>{`${money} USD/${time}`}</strong>
        </p>
      </div>
      <Modal
        title='Are you sure you want to buy this Purchase ?'
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
            style={{ width: '100%', borderRadius: '15px' }}
            onClick={handleOk}
          >
            <strong>Buy</strong>
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default function Purchase() {
  var purchases = [
    {
      name: 'Pay monthly',
      des:
        'Unlimited memory \n No advertising \n  Advanced statistics \n  Automatically up top \n Use the ability to upload',
      money: 7.99,
      time: 'month'
    },
    {
      name: 'Pay yearly',
      des:
        'Unlimited memory \n No advertising \n Exclusive discounts from Adobe, Blurb, SmugMug \n  Advanced statistics \n  Automatically up top \n Use the ability to upload',
      money: 5.99,
      time: 'month'
    },
    {
      name: 'Pro',
      des:
        'Unlimited memory \n No advertising \n  Advanced statistics \n  Automatically up top \n Use the ability to upload',
      money: 7.99,
      time: '3 month'
    }
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'left', marginLeft: '4vw' }}>Billing</h2>
      <hr />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        {purchases.map((purchase, index) => (
          <Package
            key={index}
            name={purchase.name}
            des={purchase.des}
            money={purchase.money}
            time={purchase.time}
          />
        ))}
      </div>
    </div>
  );
}
