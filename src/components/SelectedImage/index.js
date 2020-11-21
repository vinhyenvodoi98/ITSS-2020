import { useState, useEffect } from 'react';
import { storage, selectDB, updateDB } from 'firebaseConfig';
import { Modal, Avatar, message } from 'antd';
import { useSelector } from 'react-redux';

const imgStyle = {
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const selectedImgStyle = {
  transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
  transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const cont = {
  backgroundColor: '#eee',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative'
};

const SelectedImage = ({
  index,
  photo,
  margin,
  direction,
  top,
  left,
  selected
}) => {
  const currentUser = useSelector((state) => state.currentUser);

  const [title, setTitle] = useState('');
  const [isSelected, setIsSelected] = useState(selected);
  //calculate x,y scale
  const sx = (100 - (30 / photo.width) * 100) / 100;
  const sy = (100 - (30 / photo.height) * 100) / 100;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

  if (direction === 'column') {
    cont.position = 'absolute';
    cont.left = left;
    cont.top = top;
  }

  const handleOnClick = (e) => {
    setIsSelected(!isSelected);
  };

  const download = async () => {
    console.log(currentUser);
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

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont }}
      className={!isSelected ? 'not-selected' : ''}
      onClick={() => setTitle(photo.title)}
    >
      <img
        alt={photo.title}
        style={{ ...imgStyle }}
        {...photo}
        onClick={handleOnClick}
      />
      <Modal
        title='Basic Modal'
        visible={isSelected}
        onOk={() => download()}
        okText='Download'
        onCancel={() => setIsSelected(!isSelected)}
        // width={photo.width}
      >
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <img
            alt={photo.title}
            style={{ height: photo.height, width: photo.width }}
            {...photo}
          />
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
      </Modal>
      <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style>
    </div>
  );
};

export default SelectedImage;
