import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { selectDB } from 'firebaseConfig';

function Images({ photo }) {
  return (
    <Col className='gutter-row' span={6} style={{ height: '60vh' }}>
      {console.log(photo)}
      <Row
        justify='center'
        style={{
          borderRadius: '20px',
          margin: '0px 10px',
          cursor: 'pointer',
          height: '100%'
        }}
      >
        <Link to={`/images/${photo.title}/${photo.id}`}>
          <img
            src={photo.src}
            alt=''
            style={{
              height: '100%',
              width: '100%',
              borderRadius: '20px',
              objectFit: 'cover'
            }}
          />
        </Link>
      </Row>
    </Col>
  );
}

export default function Album() {
  let { id } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhoto = async () => {
      var albums = await selectDB('albums', id);
      await albums.photo.forEach(async (b) => {
        var photo = await selectDB('pictures', b);
        photo.id = b;
        setPhotos((photos) => [...photos, photo]);
      });
    };
    fetchPhoto();
  }, [id]);

  return (
    <div className='detail_images' style={{ padding: '3vw' }}>
      <h1>Night</h1>
      <Row gutter={[16, 24]}>
        {console.log(photos)}
        {!!photos ? (
          photos.map((photo, index) => <Images key={index} photo={photo} />)
        ) : (
          <p>loading</p>
        )}
      </Row>
    </div>
  );
}
