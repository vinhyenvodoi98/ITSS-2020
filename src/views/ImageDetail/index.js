import { useParams } from 'react-router-dom';
import { Avatar, Tag, message, Button } from 'antd';
import { storage, selectDB, updateDB, searchDB } from 'firebaseConfig';
import CommentA from 'components/Comment';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import Images from 'components/Images';

export default function ImageDetail() {
  let { title, id } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState();

  useEffect(() => {
    const updatePhoto = async () => {
      setPhoto(await selectDB('pictures', id));
    };
    updatePhoto();
  }, [setPhoto, id]);

  useEffect(() => {
    const relationPhoto = async () => {
      if (!!photo) {
        if (!!photo.label) setPhotos(await searchDB('pictures', photo.label));
      }
    };

    relationPhoto();
  }, [photo]);

  const setComment = async () => {
    setPhoto(await selectDB('pictures', id));
  };

  const download = async () => {
    if (!!currentUser) {
      var user = await selectDB('users', currentUser.uid);
      if (user.downloadTime < 1) {
        message.warning(
          'You have reached the download limit, please upgrade VIP to continue'
        );
      } else {
        var storageRef = storage.ref();

        storageRef
          .child(`images/${title}`)
          .getDownloadURL()
          .then(function (url) {
            fetch(url, {
              method: 'GET',
              headers: {}
            })
              .then((response) => {
                response.arrayBuffer().then(function (buffer) {
                  const url = window.URL.createObjectURL(new Blob([buffer]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', title); //or any other extension
                  document.body.appendChild(link);
                  link.click();
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(function (error) {
            // Handle any errors
            console.log(error);
          });
        updateDB('users', currentUser.uid, {
          downloadTime: user.downloadTime - 1
        });
      }
    } else {
      message.warning('You must to signin to download images');
    }
  };

  return (
    <div className='detail_images'>
      <div
        className='box'
        style={{
          width: '80vw',
          height: '80vh',
          borderRadius: '10px'
        }}
      >
        {photo ? (
          <div style={{ display: 'flex', height: '100%' }}>
            <div
              style={{
                width: '70%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                alt={photo.title}
                style={{ height: '100%', width: '100%', display: 'flex' }}
                {...photo}
              />
            </div>
            <div style={{ margin: '2vh', width: '30%' }}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  type='primary'
                  danger
                  shape='circle'
                  onClick={() => download()}
                >
                  <DownloadOutlined />
                </Button>
              </div>
              <div>
                <p>
                  <strong>Tag</strong>
                </p>
                <div style={{ maxHeight: '7vh', overflow: 'auto' }}>
                  {photo.label
                    ? photo.label.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))
                    : ''}
                </div>
              </div>

              <div>
                <p>
                  <strong>Author</strong>
                </p>
                <div style={{ display: 'flex' }}>
                  <Avatar
                    size={40}
                    src={photo.author ? photo.author.img : ''}
                    style={{ marginRight: '20px' }}
                  ></Avatar>

                  <p>
                    <strong>{photo.author ? photo.author.name : ''}</strong>
                  </p>
                </div>
              </div>
              <CommentA
                doc={id}
                comment={photo.comment}
                setComment={setComment}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='relation'>
        <h1>Relation</h1>
        {!!photos ? <Images photos={photos} /> : ''}
      </div>
    </div>
  );
}
