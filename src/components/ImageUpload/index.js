import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage, db } from 'firebaseConfig';
import { Redirect } from 'react-router';

import './index.css';

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
  justifyContent: 'center'
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

function ImageUpload() {
  const [files, setFiles] = useState([]);
  const [redirect] = useState(false);

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

  const handleUpload = () => {
    files.forEach((file) => {
      const image = file;
      const uploadTask = storage.ref(`images/${image.path}`).put(image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // progrss function ....
          // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          // this.setState({ progress });
        },
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(async (url) => {
              db.collection('pictures')
                .add({
                  src: url,
                  width: 4,
                  height: 3,
                  title: image.name
                })
                .then(function (docRef) {
                  console.log('Document written with ID: ', docRef.id);
                })
                .catch(function (error) {
                  console.error('Error adding document: ', error);
                });
            });
        }
      );
    });
  };

  return (
    <div style={style}>
      {redirect ? <Redirect push to='/' /> : <></>}
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
          <button className='btn btn-light' onClick={handleUpload}>
            {'Upload'}
          </button>
        </div>
      </section>
      <br />
    </div>
  );
}

export default ImageUpload;
