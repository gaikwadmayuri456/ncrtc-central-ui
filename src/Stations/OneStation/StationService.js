import { Image, message, Table, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useInterval from '../../Components/useInterval';
import { sdr_setDevicesData, sdr_setEscalators, sdr_setFaultDetails,sdr_setMaintenanceData } from '../../Redux/Actions/StationDataActions';
/*  If device device_type =NET-TCP and sub_type=ESCL485 then this is network device we are showing only network device and only escalator data*/
/*  If device device_type =MOD and sub_type=MOD-EM then this is modbus device we are showing only modbus device for energy data*/
export default function StationService({
    requestInterval = 5000,
}) {

    const [deviceCodes, setDeviceCodes] = useState({
        escalators: undefined,
        lifts: undefined,
        energy_meters: undefined,
        io_devices: undefined,
        fire_zones: undefined,
        sesmic_zones: undefined,
    });
    const [deviceCodeToName, setDeviceCodeToName] = useState({});
    const [deviceAPIData, setDeviceAPIData] = useState({
        escalators: [],
        ioDevicesMap: [],
    });

    const dispatch = useDispatch();
    const stationId = useParams().stationId;
    const getDeviceTypes = () => {
        axios.get("/gateway/config/show")
            .then((res) => {
                const data = res.data;
                const escalators = data?.filter((d) => d?.config_key === "UI_ESC_device_codes")?.[0]?.value;
                const lifts = data?.filter((d) => d?.config_key === "UI_LIFT_device_codes")?.[0]?.value;
                const energy_meters = data?.filter((d) => d?.config_key === "UI_ENERGY_device_codes")?.[0]?.value;
                const io_devices = data?.filter((d) => d?.config_key === "UI_IO_DEVICES")?.[0]?.value;
                const fire_zones = data?.filter((d) => d?.config_key === "UI_FIRE_ZONE")?.[0]?.value;
                const sesmic_zones = data?.filter((d) => d?.config_key === "UI_SESMIC_ZONE")?.[0]?.value;
                const control_output_zone=data?.filter((d) => d?.config_key === "UI_CONTROL_ZONE")?.[0]?.value;

                if (!escalators) { console.warn("No escalators found in config") }
                if (!lifts) { console.warn("No lifts found in config") }
                if (!energy_meters) { console.warn("No energy_meters found in config") }
                if (!io_devices) { console.warn("No IO Devices found in config") }
                if (!fire_zones) { console.warn("No Fire Zone found in config") }
                if (!sesmic_zones) { console.warn("No Sesmic Zone found in config") }
                if (!control_output_zone) { console.warn("No control output zone found in config") }
                setDeviceCodes(prev => ({
                    ...prev,
                    escalators: escalators,
                    lifts: lifts,
                    energy_meters: energy_meters,
                    io_devices: io_devices,
                    fire_zones: fire_zones,
                    sesmic_zones: sesmic_zones,
                    control_output_zone:control_output_zone

                }))


                // Finding the map names for device codes
                const newDeviceCodesToName = {};
                const deviceNames = data?.filter((d) => d?.config_key.includes("Device_Name_"));
                deviceNames?.forEach((deviceName) => {
                    const deviceCode = deviceName?.config_key?.split("Device_Name_")?.[1];
                    newDeviceCodesToName[deviceCode] = deviceName?.value;
                });
                // Setting the map names for device codes
                // Eg :- { "MOD01": "Shlok" }
                setDeviceCodeToName(newDeviceCodesToName);

            })
            .catch(err => {
                console.log(err);
                // err.handleGlobally && err.handleGlobally();
                message.error("Error Getting Device Types");
            })

    }

    //get maintenance data
    const getMaintenaceData=()=>
    {
        axios.get("/show-maintenance-records")
        .then((res)=>
        {
            dispatch(sdr_setMaintenanceData(res.data))
        })
        .catch((error)=>
        {
            console.log(error)
        })
    }
    
    useEffect(()=>
    {
        getMaintenaceData()
    },[])


    // When the code starts we get the device types from config
    useEffect(() => {
        console.log("StationService useEffect Called", stationId);
        getDeviceTypes();
    }, [stationId]);



    const getEscalatorDevicesData = async () => {
        axios.get('/get_connected_device_data', {
            params: {
                station_id: stationId,
                nnn: deviceCodes.escalators,
            }
        })
            .then(res => {
                const data = res.data;
                setDeviceAPIData(prev => ({
                    ...prev,
                    escalators: data
                }))

            })
            .catch(err => {
                console.warn(err);
                message.error("Error Getting Devices Data");
            })
    }

    const getIODevicesData = async () => {
        var iodevicessplit = deviceCodes?.io_devices?.split(",")
        // It will be ["MOD01", "MOD01", "MOD02"]
        // We need to make it ["MOD01", "MOD02"]
        const uniqueIODevices = [...new Set(iodevicessplit)];

        await axios.get('/get_modbus_device_data',{
                params: {
                    all_device_code_strings: uniqueIODevices.join(","),
                }
            })
            .then(res => {
                // Creatinf a map of io devices
                const data = res.data;
                let ioDevicesMap = {};
                data.forEach((items,i)=>
                {
                    var inputsMap = {};
                    items?.inputs.forEach((input,i)=>
                    {
                        inputsMap[input?.tags?.zone] = input.fields?.value;
                    })
                    ioDevicesMap[items?.inputs[i].tags.device_code] = inputsMap;
                })
                // console.warn("IO DEVICES",ioDevicesMap)
                // for (var ioDevice of data) {
                //     var inputsMap = {};
                //     for (var input of ioDevice?.inputs) {
                //         inputsMap[input?.tags?.zone] = input.fields?.value;
                //     }
                //     ioDevicesMap[ioDevice?.inputs[0].tags.device_code] = inputsMap;
                // }
                setDeviceAPIData(prev => ({
                    ...prev,
                    ioDevicesMap: ioDevicesMap
                }))
            })
            .catch(err => {
                console.warn(err);
                message.error("Error Getting IO Devices Data");
            })

        // For now we will send the request individually
        // let ioDevicesMap = {};
        // for(var ioDevice of uniqueIODevices){
        //     console.warn(ioDevice)
        //     await axios.get(`/devices/modbus/status?device_code=${ioDevice}`)
        //         .then((res) => {
        //             var inputsMap = {};
        //             for(var input of res?.data?.inputs){
        //                 inputsMap[input?.tags?.zone] = input.fields?.value;
        //             }
        //             console.warn("inputmap",ioDevice,inputsMap)
        //             ioDevicesMap[ioDevice] = inputsMap;
        //         })
        //         .catch(err => {
        //             console.warn(err);
        //             message.error("Error Getting IO Devices Data");
        //         })
        // }
        // console.log("devicemap",ioDevicesMap)
        // setDeviceAPIData(prev => ({ 
        //     ...prev,
        //     ioDevicesMap: ioDevicesMap
        // }))
    }


    const aggregateEscalatorsData = () => {
        var escalatorsSplit = deviceCodes?.escalators?.split(",");
        var energyMeterSplit = deviceCodes?.energy_meters?.split(",");
        var ioDevicesSplit = deviceCodes?.io_devices?.split(",");
        var fireZonesSplit = deviceCodes?.fire_zones?.split(",");
        var sesmicZonesSplit = deviceCodes?.sesmic_zones?.split(",");
        var controlZonesSplit = deviceCodes?.control_output_zone?.split(",");

        var escToDataMap = {};
        for (var i = 0; i < escalatorsSplit.length; i++) {
            escToDataMap[escalatorsSplit[i]] = {
                device_code: escalatorsSplit?.[i],
                energy_device_code: energyMeterSplit?.[i],
                io_device_code: ioDevicesSplit?.[i],
                fire_zone: fireZonesSplit?.[i],
                sesmic_zone: sesmicZonesSplit?.[i],
                control_output_zone:controlZonesSplit?.[i]
            }
        }
        // console.warn("Escalators Split", deviceAPIData);


        var newData = deviceAPIData.escalators?.map(d => {
            var G_M_Power = ""// power on of status
            var G_M_UP_DN_Symbol = "" //image view of current image
            var G_M_Status = "" // speed arrow
            var G_Speed_Value = "" // current speed value
            var G_M_Speed = ""
            var G_M_Relay_Status=""
            var esc_io_device_code = escToDataMap[d.device_code].io_device_code
            var esc_io_sesmic_zone = escToDataMap[d.device_code].sesmic_zone
            var esc_io_fire_zone = escToDataMap[d.device_code].fire_zone
            var esc_io_control_output_zone = escToDataMap[d.device_code].control_output_zone

            var isSesmicAlert = deviceAPIData.ioDevicesMap?.[esc_io_device_code]?.[esc_io_sesmic_zone] == 0;
            var isFireAlert = deviceAPIData.ioDevicesMap?.[esc_io_device_code]?.[esc_io_fire_zone] == 0;
            console.warn("sesmic",esc_io_device_code,deviceAPIData.ioDevicesMap?.[esc_io_device_code]?.[esc_io_sesmic_zone] == 0)
            console.warn("fire",esc_io_device_code,deviceAPIData.ioDevicesMap?.[esc_io_device_code]?.[esc_io_fire_zone] == 0)
            if ((d.status_code >= 2000) || (d.status === "NOPOLL") || (d.status === "") || (d.status_code === "")) {
                G_M_Power = "OFF"
                G_M_Status = "NA.png"
                G_Speed_Value = "NA"
                G_M_UP_DN_Symbol = "NA.png"
            }
            else {
                G_M_Power = "ON"
                if (isSesmicAlert) {
                    G_M_Power = "OFF";
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_UP_DN_Symbol = "seismic_zone.png"
                }
                else if (localStorage.getItem(d.device_code) === 'Escalator Overridden') {
                    G_M_Power = "ON";
                    G_M_UP_DN_Symbol = "system_overiden.png"
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_Relay_Status="Escalator Overridden"
                }
                else if (localStorage.getItem(d.device_code) === 'EGRESS_UP') {
                    G_M_Power = "ON";
                    G_M_UP_DN_Symbol = "Escalator_Up.gif"
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_Relay_Status="EGRESS_UP"
                }
                else if (localStorage.getItem(d.device_code) === 'EGRESS_DOWN') {
                    G_M_Power = "ON";
                    G_M_UP_DN_Symbol = "Escalator_Down.gif"
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_Relay_Status="EGRESS_DOWN"
                }
                else if (localStorage.getItem(d.device_code) === 'STOP_RELAY_ON') {
                    G_M_Power = "ON";
                    G_M_UP_DN_Symbol = "stop_relay.png"
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_Relay_Status="STOP_RELAY_ON"
                }
                else if (isFireAlert) {
                    G_M_Power = "OFF";
                    G_M_Status = "NA.png"
                    G_Speed_Value = "NA"
                    G_M_UP_DN_Symbol = "fire-element.png"
                }
                else if (d.status == "FAULT") {
                    if (d.zone == "E14") {
                        G_M_UP_DN_Symbol = "emergency_stop.png"
                    }
                    else if (d.zone == "E47" ) {
                        G_M_UP_DN_Symbol = "EGRESS_OFF.png"
                    }
                    else if (d.zone == "E107" || d.zone == "ED1" || d.zone == "E1A") {
                        G_M_UP_DN_Symbol = "fire-element.png"
                    }
                    else if (d.zone == "E53") {
                        G_M_UP_DN_Symbol = "seismic_zone.png"
                    }
                    else {
                        G_M_UP_DN_Symbol = "fault.png"
                    }
                    G_M_Status = "fault.png"
                    G_Speed_Value = "NA"
                }
                else if (d.status == "RTS") {
                    G_M_UP_DN_Symbol = "rts.png"
                    G_M_Status = "NA.png"
                    G_Speed_Value = "0.00"
                }
                else {
                    if (d.speed >= 0.6) {
                        G_Speed_Value = "0.65"
                        G_M_Speed = "high"
                    }
                    else if (d.speed >= 0.4 && d.speed < 0.6) {
                        G_Speed_Value = "0.50"
                        G_M_Speed = "medium"
                    }
                    else if (d.speed >= 0.01 && d.speed < 0.4) {
                        G_Speed_Value = "0.25"
                        G_M_Speed = "slow"
                    }
                    else {
                        G_Speed_Value = "NA"
                        G_M_Speed = "NA"
                    }
                    if (d.status == "UP") {
                        G_M_UP_DN_Symbol = "Escalator_Up.gif"
                        if (G_M_Speed == "NA")
                            G_M_Status = "NA.png"
                        else
                            G_M_Status = "UP_" + G_M_Speed + ".gif"
                    }
                    else if (d.status == "DOWN") {
                        G_M_UP_DN_Symbol = "Escalator_Down.gif"
                        if (G_M_Speed == "NA")
                            G_M_Status = "NA.png"
                        else
                            G_M_Status = "DOWN_" + G_M_Speed + ".gif"
                    }
                    else {
                        G_M_UP_DN_Symbol = "NA.png"
                        G_M_Status = "NA.png"
                    }
                }
            }
            return {
                name: d.name,
                device_code: d.device_code,
                speed: d.speed,
                status: d.status,
                status_code: d.status_code,
                last_recv: d.last_recv,
                zone: d.zone,
                add_: d.add_,
                RTS: d.RTS,
                FAULT: d.FAULT,
                restarted: d.restarted,
                UM: d.UM,
                UP: d.UP,
                DOWN: d.DOWN,
                NOPOLL: d.NOPOLL,
                total_runtime: d.UP + d.DOWN,
                total_faulttime: d.FAULT,
                last_error_code: d.last_error_details?.zone,
                last_error_name: d.last_error_details?.add_,
                last_error_time: d.last_error_details?.start_time,
                last_5_errors: d.last_error_details,
                // energy_meter_d_code: escToEnergyMap[d.device_code] || "MODMOD",
                energy_meter_d_code: escToDataMap[d.device_code]?.energy_device_code || "MODMOD",
                esc_device_names: deviceCodeToName?.[d.device_code] || "NA",
                io_device_code: escToDataMap?.[d.device_code]?.io_device_code || "NA",
                control_output_zone: escToDataMap?.[d.device_code]?.control_output_zone || "NA",
                g_Power: G_M_Power,
                g_up_dn_symbol: G_M_UP_DN_Symbol,
                g_status: G_M_Status,
                g_speed: G_Speed_Value,
                g_relay_status:G_M_Relay_Status
            }
        })

        dispatch(sdr_setEscalators(newData));
    }

    useEffect(() => {
        if (deviceAPIData.escalators?.length > 0) {
            aggregateEscalatorsData();
        }
    }, [deviceAPIData.escalators, deviceAPIData.ioDevicesMap])



    const getLiftDevicesData = async () => {
        // axios.get('/get_connected_device_data', {
        //     params: {
        //         station_id: stationId,
        //         nnn: deviceCodes.lifts,
        //     }
        // })
        //     .then(res => {
        //         const data = res.data;

        //         dispatch(sdr_setLiftsData(data));                

        //     })
        //     .catch(err => {
        //         console.log(err);
        //         message.error("Error Getting Devices Data");
        //     })
    }

    const getEnergyDevicesData = async () => {

    }

    const getData = async () => {
        // Get the escalators data only if escalators are present in config
        deviceCodes.escalators && getEscalatorDevicesData();

        // Get the IO devices data only if IO devices are present in config
        // deviceCodes.io_devices && getIODevicesData();

        // Get the lifts data only if lifts are present in config
        deviceCodes.lifts && getLiftDevicesData();

        // Get the energy data only if energy meters are present in config
        deviceCodes.energy_meters && getEnergyDevicesData();
    }


    // The API if first called when the device codes are set
    useEffect(() => {
        console.log("StationService useEffect Called", stationId);
        getData();
    }, [deviceCodes]);



    // The API is called at the interval set by the user
    useInterval(
        () => {
            getData();
            console.log("Interval Called");
        },
        requestInterval
    )

    useEffect(() => {
        deviceCodes.io_devices && getIODevicesData();
    }, [deviceCodes])

    // DEMO if we want to send the fire request every 2 seconds
    useInterval(
        () => {
            // Get the IO devices data only if IO devices are present in config
            deviceCodes.io_devices && getIODevicesData();
        },
        3000
    )



    return (
        <>
            <HandleESCFaults />
        </>
    )
}



const HandleESCFaults = () => {
    const escalators = useSelector(state => state.stationDataReducer.escalators);
    const prevFaultDetails = useSelector(state => state.stationDataReducer.faultDetails);
    const dispatch = useDispatch();

    const [prevEscalators, setPrevEscalators] = useState([]);


    const checkForFaults = () => {
        // Loop through the escalators and find if there is any fault and newFault 
        // If there is fault set fault to true and if there is any newFault set showFault to true

        var faultPresent = false;
        var newFault = false;
        var faultEscalators = [];

        for (var escalator of escalators) {
            if (escalator.status === "FAULT") {
                faultPresent = true;

                // Check if the fault is new

                // Find the escalator in the prevEscalators
                const prevEscalator = prevEscalators.filter((e) => e.device_code === escalator.device_code)?.[0];
                console.log("Prev Escalator", prevEscalator);
                if (prevEscalator?.status !== "FAULT") {
                    newFault = true;
                }

                faultEscalators.push(escalator);
            }
        }

        console.log("Fault Present", faultPresent);
        console.log("New Fault", newFault);


        // We will showFault  
        // if there show prev showFault is true and there is a fault
        // If there is a new fault


        var showFault = prevFaultDetails.showFault;

        // This will turn off the alarm if the fault is gone.  temp comp 09/01/2023
        // if(!faultPresent){
        //     showFault = false;
        // }
        // This will turn on the alarm if there is a new fault
        if (newFault) {
            showFault = true;
        }
        // else the alarm would be in the same state as before




        var faultDetails = {
            isFault: faultPresent,
            showFault: showFault,
            faultEscalators: faultEscalators,
        }
        dispatch(sdr_setFaultDetails(faultDetails));

        setPrevEscalators(escalators);
    }

    useEffect(() => {
        checkForFaults();
    }, [escalators]);


    useEffect(() => {
        // If the showFault is true play the
        if (prevFaultDetails.showFault) {
            document.getElementById("alarm-audio-tag")?.play();
        }
        else {
            document.getElementById("alarm-audio-tag")?.pause();
        }
    }, [prevFaultDetails.showFault]);

    const hideWarning = () => {
        var faultDetails = {
            isFault: prevFaultDetails.isFault,
            showFault: false,
            faultEscalators: prevFaultDetails.faultEscalators,
        }
        dispatch(sdr_setFaultDetails(faultDetails));

    }
    return (
        <>
            {prevFaultDetails.showFault &&
                <div
                    style={{
                        position: "fixed",
                        top: "0px",
                        right: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => { hideWarning() }}
                >
                    <img src="/warning.gif" alt="warning" style={{ height: "65px", width: "140px", borderRadius: "10px" }} />
                </div>
            }
        </>
    )
}
