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

  const download = () => {
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
