import { useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import SelectedImage from 'components/SelectedImage';

function Images({ photos }) {
  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <SelectedImage
        selected={false}
        key={key}
        margin={'2px'}
        index={index}
        photo={photo}
        left={left}
        top={top}
      />
    ),
    []
  );
  return <Gallery photos={photos} renderImage={imageRenderer} />;
}

export default Images;
