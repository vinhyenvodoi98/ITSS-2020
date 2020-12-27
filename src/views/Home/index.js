import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Images from 'components/Images';
import { getPictures } from 'store/actions';
import { useSelector, useDispatch } from 'react-redux';
import { searchDB } from 'firebaseConfig';
const { TabPane } = Tabs;

function Home() {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.photos);
  const [lovePhotos, setlovePhotos] = useState();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(getPictures());
    const fetch = async () => {
      if (!!currentUser) {
        setlovePhotos(await searchDB('pictures', currentUser.attention));
      }
    };

    fetch();
  }, [dispatch, currentUser]);

  function callback(key) {
    if (key === '1') {
      dispatch(getPictures());
    }
  }

  return (
    <div className='container'>
      <Tabs
        defaultActiveKey='1'
        animated={{ inkBar: true, tabPane: true }}
        onChange={callback}
      >
        <TabPane tab='Trending' key='1'>
          {!!lovePhotos ? <Images photos={lovePhotos} /> : <></>}
        </TabPane>
        <TabPane tab='Discover' key='2'>
          <Images photos={photos} />
        </TabPane>
        <TabPane tab='Event' key='3'>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Home;
