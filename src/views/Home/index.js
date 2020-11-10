import { useEffect } from 'react';
import { Tabs } from 'antd';
import Images from 'components/Images';
import { getPictures } from 'store/actions';
import { useSelector, useDispatch } from 'react-redux';
const { TabPane } = Tabs;

function Home() {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(getPictures());
  }, [dispatch]);

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
          <Images photos={photos} />
        </TabPane>
        <TabPane tab='Sự kiện' key='3'>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Home;
