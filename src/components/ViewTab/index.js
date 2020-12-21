import { Tabs, Col, Row } from 'antd';
import Images from 'components/Images';
import { useState, useEffect } from 'react';
import { updatePhotoToAlbums } from 'firebaseConfig';
import { Link } from 'react-router-dom';
import UploadModal from 'components/UploadModal';
const { TabPane } = Tabs;

export default function ViewTab({ photos, user }) {
  const [albums, setAlbums] = useState([]);
  const [key, setKey] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const getAlbums = async () => {
        if (user) {
          let userAlbum = await updatePhotoToAlbums(user);
          setAlbums(userAlbum.albums);
        }
      };
      getAlbums();
    }, 1000);
  }, [user]);

  const callback = async (key) => {
    if (key === '2') {
      let userAlbum = await updatePhotoToAlbums(user);
      setAlbums(userAlbum.albums);
      setKey(2);
    }
  };

  return (
    <div style={{ width: '90%' }}>
      <Tabs
        defaultActiveKey='1'
        onChange={callback}
        animated={{ inkBar: true, tabPane: true }}
      >
        <TabPane tab='Photos' key='1'>
          <Images photos={photos} />
        </TabPane>
        <TabPane tab='Albums' key='2'>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <UploadModal isAddAlbum={true} />
          </div>

          {key === 2 ? (
            <div
              style={{
                display: 'flex'
              }}
            >
              {albums.map((album, index) =>
                !!album.photos ? (
                  <Link key={index} to={`/album/${album.value}`}>
                    <div style={{ padding: '10px 15px' }}>
                      {console.log(album)}
                      <div
                        className='box'
                        style={{
                          borderRadius: '20px',
                          width: '200px',
                          height: '150px',
                          cursor: 'pointer'
                        }}
                      >
                        <Row gutter={16} style={{ height: '100%' }}>
                          <Col
                            className='gutter-row'
                            span={16}
                            style={{
                              backgroundColor: 'red',
                              borderRadius: '15px 0px 0px 15px',
                              padding: '0'
                            }}
                          >
                            {album.photos[0] ? (
                              <img
                                src={album.photos[0].src}
                                alt='1'
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  borderRadius: '15px 0px 0px 15px',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </Col>
                          <Col span={8} style={{ padding: '0px' }}>
                            <Col
                              style={{
                                backgroundColor: 'grey',
                                height: '50%',
                                borderRadius: '0px 15px 0px 0px',
                                padding: '0'
                              }}
                            >
                              {album.photos[1] ? (
                                <img
                                  src={album.photos[1].src}
                                  alt='1'
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: '0px 15px 0px 0px',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </Col>
                            <Col
                              style={{
                                backgroundColor: '#c3cfe2',
                                height: '50%',
                                borderRadius: '0px 0px 15px 0px',
                                padding: '0'
                              }}
                            >
                              {album.photos[2] ? (
                                <img
                                  src={album.photos[2].src}
                                  alt='1'
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: '0px 0px 15px 0px',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </Col>
                          </Col>
                        </Row>
                      </div>
                      <p style={{ textAlign: 'center' }}>
                        <strong>{album.label}</strong>
                      </p>
                    </div>
                  </Link>
                ) : (
                  <p key={index}></p>
                )
              )}
            </div>
          ) : (
            ''
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}
