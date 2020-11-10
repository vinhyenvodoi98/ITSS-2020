import { useState, useEffect } from 'react';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { storage } from 'firebaseConfig';

const Checkmark = ({ selected, download }) => (
  <div
    style={
      selected
        ? {
            left: '4px',
            top: '4px',
            position: 'absolute',
            zIndex: 1,
            height: '40px',
            width: '40px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        : { display: 'none' }
    }
    onClick={() => download()}
  >
    <CloudDownloadOutlined />
  </div>
);

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
  const [url, setUrl] = useState('');
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

  const download = () => {
    var storageRef = storage.ref('images');
    storageRef
      .child('uni.png')
      .getDownloadURL()
      .then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element:
        var img = document.getElementById('myimg');
        img.src = url;
      })
      .catch(function (error) {
        // Handle any errors
      });
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont }}
      className={!isSelected ? 'not-selected' : ''}
      onClick={() => setUrl(photo.title)}
    >
      <Checkmark selected={isSelected ? true : false} download={download} />
      <img
        alt={photo.title}
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        {...photo}
        onClick={handleOnClick}
      />
      <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style>
    </div>
  );
};

export default SelectedImage;
