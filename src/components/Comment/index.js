import { Comment, Avatar, Form, List, Input } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateComment } from 'firebaseConfig';
import { getPictures } from 'store/actions';

export default function CommentA({ doc, comment }) {
  const [value, setValue] = useState('');
  const [setIsSubmitting] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

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
    dispatch(getPictures());
  };

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout='horizontal'
      renderItem={(props) => <Comment {...props} />}
    />
  );

  return (
    <div className='comment'>
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
  );
}
