import { Tag, Button } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { useState, useEffect } from 'react';
import './index.css';
import { selectDB, updateDB } from 'firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setCurrentUsers } from 'store/actions';

export default function SelectTag() {
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const currentUser = useSelector((state) => state.currentUser);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    const fetchLabel = async () => {
      let label = await selectDB('label', 'label');
      setAllTags(label.label);
    };
    fetchLabel();
  }, []);

  const handleClose = (removedTag) => {
    const tagss = tags.filter((tag) => tag !== removedTag);
    console.log(tagss);
    setTags(tagss);
  };

  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const setTag = (tag) => {
    let index = tags.indexOf(tag);
    if (index === -1) {
      setTags((tags) => [...tags, tag]);
    } else {
      let arr = tags.filter(function (item) {
        return item !== tag;
      });
      setTags(arr);
    }
  };

  const forMapAll = (tag) => {
    const tagElem = (
      <Tag
        onClick={() => setTag(tag)}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );

    const tagElemSelect = (
      <Tag
        color='processing'
        onClick={() => setTag(tag)}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tags.indexOf(tag) !== -1 ? tagElemSelect : tagElem}
      </span>
    );
  };

  const updateAttention = async () => {
    updateDB('users', currentUser.uid, { attention: tags });
    setTimeout(async () => {
      let user = await selectDB('users', currentUser.uid);
      dispatch(setCurrentUsers(user));
    }, 1000);
    setTimeout(() => {
      setRedirect('/');
    }, 2000);
  };

  const tagChild = tags.map(forMap);
  const allTagChild = allTags.map(forMapAll);

  return (
    <div className='detail_images'>
      {!!currentUser && !!redirect ? <Redirect to='/' /> : <></>}
      <div className='box' style={{ marginTop: '5vh' }}>
        {/* ///// */}
        <h5 style={{ marginLeft: '10px', fontWeight: '500' }}>
          Your Attention
        </h5>
        <div className='select_tag_area'>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: (e) => {
                e.target.style = '';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        <h5 style={{ marginLeft: '10px', fontWeight: '500' }}>
          Select at least 5 Tags
        </h5>
        <div
          className='select_tag_area select_tags'
          style={{ height: '400px', overflow: 'auto' }}
        >
          {allTagChild}
        </div>
        {tags.length >= 5 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '20px'
            }}
          >
            <Button type='primary' onClick={() => updateAttention()}>
              Next
            </Button>
          </div>
        ) : (
          <></>
        )}

        {/* ///// */}
      </div>
    </div>
  );
}
