import { useSelector } from 'react-redux';
import { Steps, Button } from 'antd';
import { useState } from 'react';
import CreditCard from 'components/CreditCard';
import { updateDB } from 'firebaseConfig';
import Purchase from 'components/Purchase';

const { Step } = Steps;

export default function Credit() {
  const [current, setCurrent] = useState(1);
  const currentUser = useSelector((state) => state.currentUser);

  const steps = [
    {
      title: 'Add Credit Card',
      content: 'First-content'
    },
    {
      title: 'Pay',
      content: 'Second-content'
    }
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onCardSubmit = (formData) => {
    updateDB('users', currentUser.uid, { credit: formData.formData });
    next();
  };

  return (
    <div className='detail_images'>
      <div
        className='box'
        style={{
          width: '80vw',
          height: '80vh',
          borderRadius: '10px',
          marginTop: '3vh'
        }}
      >
        <div style={{ width: '40%', margin: 'auto' }}>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>

        <div className='steps-content'>
          {current === 0 ? (
            <div style={{}}>
              <CreditCard onCardSubmit={onCardSubmit} />
            </div>
          ) : (
            <div>
              <Purchase />
            </div>
          )}
        </div>
        {current > 0 && (
          <Button
            style={{ borderRadius: '10px', margin: '2vw 4vw' }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {/* <div className='steps-action'>
          {current < steps.length - 1 && (
            <Button type='primary' onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type='primary' onClick={() => console.log('sss')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div> */}
      </div>
    </div>
  );
}
