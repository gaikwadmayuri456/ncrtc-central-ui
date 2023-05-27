import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Spin } from "antd";
import moment from "moment";
import axios from "axios";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";
import { useReactToPrint } from 'react-to-print';
import { Dropdown, message, Space } from 'antd';

const SMSLogs = () => {
    const componentpDF = useRef()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const currDate = moment().format("DD-MM-YYYY hh:mm:ss");
    useEffect(() => {
        axios.get("/sms_mobile_number/show_sms_reports")
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                // setLoading(false)
            })
    },[])
    const headers = [
        { label: "ID", key: "id" },
        { label: "Station Name", key: "station_name" },
        { label: "Escalator Name", key: "esc_name" },
        { label: "Mobile Number", key: "mobile_number" },
        { label: "Error", key: "error_zone" },
        { label: "SMS Content", key: "sms_content" },
    ];
    const columns = [
        {

            title: "SMS No",
            dataIndex: "id",
            key: "id"
        },
        {

            title: "Station Name",
            dataIndex: "station_name",
            key: "station_name"
        },
        {

            title: "Escalator Name",
            dataIndex: "esc_name",
            key: "esc_name",

        },
        {
            title: "Fault Name",
            dataIndex: "error_zone",
            key: "error_zone"
        },
        {

            title: "Mobile No",
            dataIndex: "mobile_number",
            key: "mobile_number"
        },
        {

            title: "Fault Generation Date",
            dataIndex: "error_occur_dt",
            key: "error_occur_dt"
        },
        // {

        //     title:"Fault Rectification Date",
        //     dataIndex:"fault_rectification_date",
        //     key:"fault_rectification_date"
        // },
        {

            title: "SMS Content",
            dataIndex: "sms_content",
            key: "sms_content"
        },
    ]
    const downloadpdf = useReactToPrint({
        content: () => componentpDF.current,
        documentTitle: "SMS_LOGS" + "_" + currDate + ".pdf",
        onAfterPrint: () => message.success("PDF Report Saved Successfully")
    })
    const items = [
        {
            key: '1',
            label: (
                <>
                    <CSVLink
                        data={data}
                        headers={headers}
                        separator={","}
                        filename={"SMSREPORTS" + "_" + currDate + ".csv"}
                        target="/Desktop"
                    >
                        <Button
                            type="primary"
                            // icon={<DownloadOutlined />}
                            size={"middle"}
                        >Export To Excel</Button>
                    </CSVLink>
                </>
            ),
        },
        {
            key: '2',
            label: (
                <>
                    <Button type="primary" onClick={downloadpdf}>Export To PDF</Button>
                </>
            ),
        },
    ]
    return (
        <div>

            {loading ? <Spin size="large" /> :
                <>
                    <div style={{ marginLeft: "92%" ,marginBottom:"5px"}}>
                        <>
                            <Space direction="vertical">
                                <Space wrap>
                                    <Dropdown
                                        menu={{
                                            items,
                                        }}
                                        placement="bottomLeft"
                                    >
                                        <Button type="primary">Download As</Button>
                                    </Dropdown>
                                </Space>
                            </Space>
                        </>
                    </div>
                    <div ref={componentpDF}>
                    <Table columns={columns} dataSource={data} bordered />
                    </div>
                </>
            }
         </div>
    )
}

export default SMSLogs