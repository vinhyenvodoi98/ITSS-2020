import { Avatar } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectDB } from 'firebaseConfig';

export default function Profile() {
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    const fetchProfile = async () => {
      setUser(await selectDB('users', id));
    };
    fetchProfile();
  }, [id]);

  return (
    <>
      {user ? (
        <div className='detail_images' style={{ marginTop: '5vh' }}>
          <Avatar size={180} src={user.photoURL}></Avatar>
          <h1>{user.displayName}</h1>
          <p>{user.email}</p>
          {id === currentUser.uid ? (
            <p>
              You have : <strong>{user.downloadTime}</strong> download time
            </p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}