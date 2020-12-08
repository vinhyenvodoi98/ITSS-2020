import { useSelector } from 'react-redux';
import Images from 'components/Images';

export default function Search() {
  const photos = useSelector((state) => state.photos);
  const currentSearch = useSelector((state) => state.currentSearch);

  return (
    <div className='detail_images'>
      <div style={{ textAlign: 'left', width: '90%', marginTop: '3vh' }}>
        <h1>Your Image</h1>
        <div
          className='box detail_images'
          style={{ width: '100px', height: '60px', borderRadius: '15px' }}
        >
          <img
            style={{ width: 'auto', height: '100%' }}
            src={currentSearch}
            alt='your images'
          />
        </div>
      </div>
      <div className='relation'>
        <h1>Similar Images</h1>
        {!!photos ? <Images photos={photos} /> : ''}
      </div>
    </div>
  );
}
