import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { storage, db, auth, selectDB, insertDB } from 'firebaseConfig';
import { Redirect } from 'react-router';
import { message, Spin } from 'antd';
import './index.css';
import { getPictures, searchPictures, setCurrentSearch } from 'store/actions';
const axios = require('axios');

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const style = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function ImageUpload({ close, isUpload }) {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirect] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUser(authUser);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} alt='preview' />
      </div>
    </div>
  ));

  const removeImage = () => {
    setFiles([]);
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleUpload = (close) => {
    files.forEach((file) => {
      setIsLoading(true);

      if (file.size > 1000000) {
        var imgWidth;
        var imgHeight;
        var imageSize = new Image();
        let fr = new FileReader();

        fr.onload = function () {
          if (fr !== null && typeof fr.result == 'string') {
            imageSize.src = fr.result;
          }
        };
        fr.readAsDataURL(file);

        imageSize.onload = async function () {
          imgWidth = imageSize.width;
          imgHeight = imageSize.height;
        };
        const image = file;
        const uploadTask = storage.ref(`images/${image.path}`).put(image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            // error function ....
            console.log(error);
          },
          () => {
            storage
              .ref('images')
              .child(image.name)
              .getDownloadURL()
              .then(async (url) => {
                console.log({ url });
                try {
                  let label = await axios.post(
                    'https://labelingimages.herokuapp.com/api/classify',
                    {
                      url
                    }
                  );

                  console.log('label', label.data);

                  let labelDb = await selectDB('label', 'label');

                  await label.data.forEach((lb) => {
                    if (labelDb.label.indexOf(lb) === -1) {
                      labelDb.label.push(lb);
                    }
                  });

                  console.log('labelDb', labelDb);

                  await insertDB('label', 'label', labelDb);

                  db.collection('pictures')
                    .add({
                      src: url,
                      width: imgWidth,
                      height: imgHeight,
                      title: image.name,
                      author: {
                        img: currentUser.photoURL,
                        name: currentUser.displayName
                      },
                      label: label.data,
                      size: Math.floor(file.size / 100000) / 10
                    })
                    .then(function (docRef) {
                      console.log('Document written with ID: ', docRef.id);
                      message.success('Upload successfully');
                      setIsLoading(false);
                      setFiles([]);
                      dispatch(getPictures());
                      close();
                    })
                    .catch(function (error) {
                      message.error('Upload failed');
                      console.error('Error adding document: ', error);
                    });
                } catch (e) {
                  console.log(e);
                }
              });
          }
        );
      } else {
        alert(`${file.name} is must be over 1MB`);
      }
    });
  };

  const handleSearch = (close) => {
    files.forEach((file) => {
      setIsLoading(true);

      var imageSize = new Image();
      let fr = new FileReader();

      fr.onload = function () {
        if (fr !== null && typeof fr.result == 'string') {
          imageSize.src = fr.result;
        }
      };
      fr.readAsDataURL(file);

      const image = file;
      const uploadTask = storage.ref(`images/${image.path}`).put(image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(async (url) => {
              console.log({ url });
              try {
                let label = await axios.post(
                  'https://labelingimages.herokuapp.com/api/classify',
                  {
                    url
                  }
                );
                console.log('label', label);

                dispatch(searchPictures(label.data));
                dispatch(setCurrentSearch(url));
                setSearchDone(true);
                setFiles([]);
                setIsLoading(false);
                close();
              } catch (e) {
                console.log(e);
              }
            });
        }
      );
    });
  };

  return (
    <div style={style}>
      {redirect ? <Redirect push to='/' /> : <></>}
      {searchDone ? <Redirect push to='/search' /> : <></>}
      <br />
      <section className='container'>
        <div className='drag-box' {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>{'Drag and Drop your image here'}</p>
        </div>
        <aside style={thumbsContainer} onClick={removeImage}>
          {thumbs}
        </aside>

        <div className='button-area'>
          {isUpload ? (
            <button
              className='btn btn-light'
              onClick={() => handleUpload(close)}
            >
              {'Upload'}
            </button>
          ) : (
            <button
              className='btn btn-light'
              onClick={() => handleSearch(close)}
            >
              {'Search'}
            </button>
          )}
        </div>
      </section>

      {isLoading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            opacity: 0.8
          }}
        >
          <Spin size='large' />
          loading...
        </div>
      ) : (
        ''
      )}
      <br />
    </div>
  );
}

export default ImageUpload;
