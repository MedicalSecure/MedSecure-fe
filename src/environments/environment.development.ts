import { EnvironmentConfiguration } from '../app/models/environment-configuration';

const localhostUrl = 'https://localhost:44364/';

export const environment: EnvironmentConfiguration = {
  production: false,
  environmentName: 'development',
  apiUrl: localhostUrl,
  apiEndpoints: {
    getRoomByName: 'rooms/{roomName}',
    getRooms: 'rooms',
    updateRoom: 'rooms',
    createRoom: 'rooms',
    createWaste: 'wastes',
    getWastes: 'wastes',
    updateWaste: 'wastes',
    getWastesByRoomId: 'wastes/room/{roomId}',
    createProduct: 'products',
    getProducts: 'products',
    updateProduct: 'products',
    getProductByName: 'products/{productName}',
  },
  adb2cConfig: {
    clientId: 'ba8bc284-466c-4627-a83a-9833f26db722',
    readScopeUrl:
      'https://medsecure.onmicrosoft.com/Data.Access/api/Waste.Read',
    writeScopeUrl:
      'https://medsecure.onmicrosoft.com/Data.Access/api/Waste.Write',
    apiEndpointUrl: 'https://localhost:44364/',
  },
  cacheTimeInMinutes: 30,
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};

