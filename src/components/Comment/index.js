import { Comment, Avatar, Form, List, Input, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState, createElement } from 'react';
import { useSelector } from 'react-redux';
import { updateComment } from 'firebaseConfig';
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled
} from '@ant-design/icons';

export default function CommentA({ doc, comment, setComment }) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction('liked');
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction('disliked');
  };

  const handleSubmit = async () => {
    if (!value) {
      return;
    }

    setIsSubmitting(true);

    await updateComment('pictures', doc, {
      author: currentUser.displayName,
      avatar: currentUser.photoURL,
      content: value,
      datetime: moment().fromNow()
    });
    setValue('');
    setComment();
  };

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout='horizontal'
      renderItem={(props) => <Comment {...props} />}
    />
  );

  return (
    <>
      <div className='like'>
        <Tooltip key='comment-basic-like' title='Like'>
          <span onClick={like}>
            {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
            <span className='comment-action'>{likes}</span>
          </span>
        </Tooltip>

        <Tooltip key='comment-basic-dislike' title='Dislike'>
          <span onClick={dislike}>
            {React.createElement(
              action === 'disliked' ? DislikeFilled : DislikeOutlined
            )}
            <span className='comment-action'>{dislikes}</span>
          </span>
        </Tooltip>
      </div>
      <div className='comment'>
        <hr />
        {!!comment && <CommentList comments={comment} />}

        {currentUser ? (
          <Comment
            avatar={
              <Avatar
                src={currentUser ? currentUser.photoURL : ''}
                size={40}
                alt='Han Solo'
              />
            }
            content={
              <>
                <Form.Item>
                  <Input
                    style={{ marginTop: '5px' }}
                    placeholder='Comments'
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(event) =>
                      event.which === 13 ? handleSubmit() : ''
                    }
                    value={value}
                  />
                </Form.Item>
              </>
            }
          />
        ) : (
          ''
        )}
      </div>
    </>
  );
}
