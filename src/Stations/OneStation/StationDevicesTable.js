import React, { useState } from 'react'
import { Button, Image, message, Space, Table, Tag, Tooltip, Row, Col, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { Typography } from 'antd';
import { GetPowerTag, GetSymbol, GetStatus, GetSpeed } from "./Components"
import axios from 'axios';
import Icon from '@ant-design/icons';
// # const modbus_device="MOD01"

export default function StationDevicesTable() {
    const NEXTICON = () => (
        <Image src="../../next.png" style={{ color: "white" }} height="20px" width="20px" preview={false} />
    );
    const { Title } = Typography;
    const stationId = useParams().stationId;
    const stationDataReducer = useSelector(state => state.stationDataReducer);
    const escalatorsData = useSelector(state => state.stationDataReducer.escalators);

    const [data, setData] = useState({})
    function settext(device_code) {
         console.log(JSON.stringify(device_code));
    }
    const columns = [
        {
            title: <><b style={{ display: "flex", justifyContent: "center", fontSize: "30px" }}>Escalator Monitoring</b></>,
            children: [{

                title: "Name",
                dataIndex: "name",
                key: "name",
                width: 100,
                align: "center",
                render: (text, record) => (
                    <> {text}
                        <br></br>
                        {record.esc_device_names}

                        {
                            process.env.REACT_APP_DEBUG === "1" &&
                            (
                                <>
                                    <br></br>
                                    {record.device_code}
                                    <br></br>
                                    {record.energy_meter_d_code}
                                    <br></br>
                                    {record.io_device_code}
                                    <br></br>
                                    {record.control_output_zone}
                                </>
                            )
                        }

                        {/* <Button onClick={settext(record.device_code)}>ddd</Button> */}
                    </>
                )
            },
            {
                title: "Power",
                align: "center",
                width: 40,
                render: (text, record) => (
                    <>
                        {/* <GetPowerTag
                            status_code={parseInt(record?.status_code)}
                            status={record?.status}
                        /> */}
                        <Button  shape="circle"  style={record.g_Power =="ON"?{backgroundColor: "Green", color: "white"}:{backgroundColor: "red", color: "white"}}  size="large"> {record.g_Power}</Button>
                    </>
                ),
            },
            {
                title: "Symbol",
                align: "center",
                width: 100,
                render: (text, record) => (
                    <>
                        {/* <GetSymbol
                            status_code={parseInt(record?.status_code)}
                            status={record?.status}
                            zone={record?.zone}
                            device_code={record?.device_code}
                        /> */}
                        <Image preview={false} src={`../../${record.g_up_dn_symbol}`} height={70} width={100}/>
                        {/* {
                            record.g_up_dn_symbol
                        }
                        {
                            record.g_up_dn_symbol
                        }
                        {

                        } */}
                    </>
                ),
            },
            {
                title: "Status",
                align: "center",
                width: 120,
                render: (text, record) => (
                    <>
                        {/* <GetStatus
                            status_code={parseInt(record?.status_code)}
                            status={record?.status}
                            speed={record?.speed}
                        /> */}
                        <Image preview={false} src={`../../${record.g_status}`} height={50} width={50}/>
                    </>

                ),
            },
            {
                title: <>
                    {"Speed"}
                    <br />
                    {" m/s"}
                </>,
                align: "center",
                width: 50,
                render: (text, record) => (
                    <>
                        {
                            record.g_speed
                        }
                    </>
                ),
            },
            {
                title: "Todays",
                children: [
                    {
                        title: "Run Time",
                        width: 50,
                        align: "center",
                        render: (text, record) => moment.utc((record?.total_runtime) * 1000).format("HH:mm:ss"),
                    },
                    {
                        title: "Down Time",
                        align: "center",
                        width: 50,
                        render: (text, record) => moment.utc((record?.total_faulttime) * 1000).format("HH:mm:ss"),
                    },

                ]
            },

            {
                title: "Last Error",
                align: "center",
                width: 200,
                render: (text, record) => (
                    <>
                        <Tooltip title={record?.last_error_name}>
                            <b>{record?.last_error_code}</b>
                            <br></br>{record?.last_error_name}
                        </Tooltip>
                        <br />
                        {record?.last_error_time && moment(record?.last_error_time).format("DD-MM-YYYY HH:mm:ss")}
                    </>
                )
            }]
        },
        {
            title: <><b style={{ display: "flex", justifyContent: "center", fontSize: "30px" }}>Energy Monitoring</b></>,
            children: [
                {
                    title: "Voltage",
                    dataIndex: "device_code",
                    width: 90,
                    align: "center",
                    key: "device_code",
                    render: (text, record) => (
                        <iframe frameBorder="0" src={axios.defaults.baseURL1 + process.env.REACT_APP_GRAPHANA_BASEURL_VOLTAGE + record.energy_meter_d_code} height="65" width="200"></iframe>
                    ),
                },
                {
                    title: "Current",
                    align: "center",
                    dataIndex: "device_code",
                    width: 90,
                    render: (text, record) => (
                        <iframe frameBorder="0" src={axios.defaults.baseURL1 + process.env.REACT_APP_GRAPHANA_BASEURL_CURRENT + record.energy_meter_d_code} height="65" width="200"></iframe>
                    ),
                },
                {
                    title: "Consumption",
                    align: "center",
                    dataIndex: "device_code",
                    width: 90,
                    render: (text, record) => (
                        <iframe frameBorder="0" src={axios.defaults.baseURL1 + process.env.REACT_APP_GRAPHANA_BASEURL_ENERGY + record.energy_meter_d_code} height="65" width="200"></iframe>
                    ),
                },
            ]
        },
        {
            title: "Voltage",
            hidden: process.env.REACT_APP_SHOW_VOLTAGE === "true" ? false : true,
            render: (text, record) => record?.energy?.voltage ?
                record?.energy?.voltage + " V"
                : "No Data"
        },
        {
            title: "Current",
            hidden: process.env.REACT_APP_SHOW_CURRENT === "true" ? false : true,
            render: (text, record) => record?.energy?.current ?
                record?.energy?.current + " A"
                : "No Data"
        },
        {
            title: "Energy Consumption",
            hidden: process.env.REACT_APP_SHOW_ENERGY === "true" ? false : true,
            render: (text, record) => record?.energy?.energy_consumption ?
                record?.energy?.energy_consumption + " kWh"
                : "No Data"
        },
        {
            title: "View",
            align: "center",
            width: 50,
            render: (text, record) => (
                <div className='actions-outer-div'>
                    <Link to={`/stations/${stationId}/${record?.device_code}`}>
                        <Button icon={<Icon component={NEXTICON} type="primary" />}
                            size='medium'
                            type="default"
                            style={{ backgroundColor: "#A0B7BF" }}
                        >
                        </Button>
                    </Link>
                </div>
            ),

        }
    ].filter(x => !x.hidden);
    return (
        <div className='my-form-outer'>
            {/* <Row>
                <Col style={{ width: "55.5%" }}> <Title level={3} style={{ display: "flex", justifyContent: "center", backgroundColor: "#A2B9C0", borderRight: "4px solid white" }}>Escalator Monitoring</Title></Col>
                <Col style={{ width: "44.5%" }}><Title level={3} style={{ display: "flex", justifyContent: "center", backgroundColor: "#81B622" }}>Energy Monitoring</Title></Col>
            </Row> */}
            <Table
                size="small"
                bordered={true}
                columns={columns}
                dataSource={escalatorsData}
                pagination={{ defaultPageSize: 7, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
                rowClassName={(record, index) => "rowclass"}

            />
        </div>
    )
}


