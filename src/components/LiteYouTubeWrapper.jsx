import { useEffect } from 'react';

export default function LiteYouTubeWrapper({ 
  videoId, 
  title = "YouTube video player",
  autoplay = false,
  nocookie = true,
  posterquality = "hqdefault"
}) {
  useEffect(() => {
    // Importar el componente solo en el cliente
    import('@justinribeiro/lite-youtube');
  }, []);

  return (
    <lite-youtube 
      videoid={videoId}
      videotitle={title}
      autoplay={autoplay}
      nocookie={nocookie}
      posterquality={posterquality}
      style={{ width: '100%', height: '100%' }}
      className="aspect-video"
    />
  );
}
