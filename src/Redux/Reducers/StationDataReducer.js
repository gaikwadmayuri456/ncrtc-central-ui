const initialState = () => {
    // Process data if any !!

    var state = {
        devicesData: [],
        escalators: [],
        maintenanceData:[],

        faultDetails: {
            isFault: false,
            showFault: false,
        },
    };

    return state;
};


const stationDataReducer = (state = initialState(), action) => {
    switch (action.type) {
        case "SDR/SET_DEVICES_DATA":
            return {
                ...state,
                devicesData: action.payload,
            };

        case "SDR/SET_ESCALATORS":
            return {
                ...state,
                escalators: action.payload,
            }

        case "SDR/SET_FAULT_DETAILS":
            return {
                ...state,
                faultDetails: action.payload,
            }
        case "SDR/SET_MAINTENANCE_DATA":
                return {
                    ...state,
                    maintenanceData: action.payload,
                }    
            

        default:
            return state;
    }
};

export default stationDataReducer;

