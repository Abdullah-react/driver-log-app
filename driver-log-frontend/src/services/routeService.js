import axios from 'axios';

export const calculateRoute = async (start, end) => {
  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}`, 
      {
        params: {
          overview: 'full',
          geometries: 'geojson'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Rota hesaplama hatası:', error);
    return null;
  }
};
