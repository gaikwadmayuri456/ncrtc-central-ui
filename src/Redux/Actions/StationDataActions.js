export const sdr_setDevicesData = (devicesData) => {
    return {
        type: "SDR/SET_DEVICES_DATA",
        payload: devicesData,
    };
}


export const sdr_setEscalators = (escalators) => {
    return {
        type: "SDR/SET_ESCALATORS",
        payload: escalators,
    };
}


export const sdr_setFaultDetails = (fault) => {
    return {
        type: "SDR/SET_FAULT_DETAILS",
        payload: fault,
    };
}

export const sdr_setMaintenanceData = (maintenanceData) => {
    return {
        type: "SDR/SET_MAINTENANCE_DATA",
        payload: maintenanceData,
    };
}

