import Card from 'react-credit-cards';
import { useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import './index.css';

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from './utils';

export default function CreditCard({ onCardSubmit }) {
  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [focused, setFocused] = useState('');

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setIssuer(issuer);
    }
  };

  const handleInputFocus = ({ target }) => {
    setFocused(target.name);
  };

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
    }
    if (target.name === 'number') setNumber(target.value);
    else if (target.name === 'name') setName(target.value);
    else if (target.name === 'expiry') setExpiry(target.value);
    else if (target.name === 'cvc') setCvc(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    onCardSubmit({ formData });
  };

  return (
    <div id='PaymentForm' style={{ marginTop: '2vw' }}>
      <Card
        number={number}
        name={name}
        expiry={expiry}
        cvc={cvc}
        focused={focused}
        callback={handleCallback}
      />
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='tel'
            name='number'
            className='form-control'
            placeholder='Card Number'
            pattern='[\d| ]{16,22}'
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <small>E.g.: 49..., 51..., 36..., 37...</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            name='name'
            className='form-control'
            placeholder='Name'
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <div className='row'>
          <div className='col-6'>
            <input
              type='tel'
              name='expiry'
              className='form-control'
              placeholder='Valid Thru'
              pattern='\d\d/\d\d'
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className='col-6'>
            <input
              type='tel'
              name='cvc'
              className='form-control'
              placeholder='CVC'
              pattern='\d{3,4}'
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>
        <input type='hidden' name='issuer' value={issuer} />
        <div className='form-actions'>
          <button className='btn btn-primary btn-block'>PAY</button>
        </div>
      </form>
    </div>
  );
}
