// environment.prod.ts

import { EnvironmentConfiguration } from '../app/models/environment-configuration';

const serverUrl = 'https://medsecure.azurewebsites.net/api';

export const environment: EnvironmentConfiguration = {
  production: true,
  environmentName: 'production',
  apiUrl: serverUrl,
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
    clientId: '8c20d337-b4ca-473a-a65a-5de0dc1bdec7',
    readScopeUrl:
      'https://medsecure.onmicrosoft.com/Data.Access/prod/api/Waste.Read',
    writeScopeUrl:
      'https://medsecure.onmicrosoft.com/Data.Access/prod/api/Waste.Write',
    apiEndpointUrl: 'https://localhost:44364/',
  },
  cacheTimeInMinutes: 30,
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
