import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { db } from 'firebaseConfig';
import Images from 'components/Images';

const { TabPane } = Tabs;

function Home() {
  const [photos, setPhotos] = useState([]);

  const fetchImage = () => {
    db.collection('pictures')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setPhotos((photos) => [...photos, doc.data()]);
        });
      });
  };

  useEffect(() => {
    fetchImage();
  }, []);

  function callback(key) {
    console.log(key);
  }

  return (
    <div className='container'>
      <Tabs
        defaultActiveKey='1'
        animated={{ inkBar: true, tabPane: true }}
        onChange={callback}
      >
        <TabPane tab='Khám phá' key='1'>
          <Images photos={photos} />
        </TabPane>
        <TabPane tab='Xu Hướng' key='2'>
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab='Sự kiện' key='3'>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Home;
