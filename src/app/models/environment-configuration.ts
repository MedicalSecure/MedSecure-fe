export interface EnvironmentConfiguration {
    environmentName: string;
    production: boolean;
    apiUrl: string;
    apiEndpoints: {
        getRoomByName: string,
        getRooms: string,
        updateRoom: string,
        createRoom: string,
        createWaste: string,
        getWastes: string,
        updateWaste: string,
        getWastesByRoomId: string,
        createProduct: string,
        getProducts: string,
        updateProduct: string,
        getProductByName: string,
    },
    adb2cConfig: {
        clientId: string;
        readScopeUrl: string;
        writeScopeUrl: string;
        apiEndpointUrl: string;
    }
    cacheTimeInMinutes: number;
    apiConfig: {
        scopes: [string],
        uri: string
    }
}