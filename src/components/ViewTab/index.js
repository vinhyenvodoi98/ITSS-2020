import { Tabs, Col, Row } from 'antd';
import Images from 'components/Images';

export default function ViewTab({ photos, albums }) {
  const { TabPane } = Tabs;
  return (
    <div style={{ width: '90%' }}>
      <Tabs defaultActiveKey='1' animated={{ inkBar: true, tabPane: true }}>
        <TabPane tab='Photos' key='1'>
          <Images photos={photos} />
        </TabPane>
        <TabPane tab='Albums' key='2'>
          <div
            style={{
              display: 'flex'
            }}
          >
            {albums
              ? albums.map((a) => (
                  <div style={{ padding: '10px 15px' }}>
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
                          <img
                            src='https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg'
                            alt='1'
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: '15px 0px 0px 15px',
                              objectFit: 'cover'
                            }}
                          />
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
                            <img
                              src='https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg'
                              alt='1'
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '0px 15px 0px 0px',
                                objectFit: 'cover'
                              }}
                            />
                          </Col>
                          <Col
                            style={{
                              backgroundColor: '#c3cfe2',
                              height: '50%',
                              borderRadius: '0px 0px 15px 0px',
                              padding: '0'
                            }}
                          >
                            <img
                              src='https://post.greatist.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg'
                              alt='1'
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '0px 0px 15px 0px',
                                objectFit: 'cover'
                              }}
                            />
                          </Col>
                        </Col>
                      </Row>
                    </div>
                    <p style={{ textAlign: 'center' }}>
                      <strong>{a.label}</strong>
                    </p>
                  </div>
                ))
              : ''}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
