// This file manages synchronization with wearable devices.

const syncWearableData = async (deviceId) => {
    try {
        const response = await fetch(`/api/wearable/${deviceId}/sync`);
        if (!response.ok) {
            throw new Error('Failed to sync data with wearable device');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error syncing wearable data:', error);
    }
};

const getWearableData = async (userId) => {
    try {
        const response = await fetch(`/api/wearable/${userId}/data`);
        if (!response.ok) {
            throw new Error('Failed to fetch wearable data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching wearable data:', error);
    }
};

export { syncWearableData, getWearableData };