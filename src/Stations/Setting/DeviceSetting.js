import react, { useEffect, useState } from "react";
import { Table, message, Modal, Button, Form, Input, Space, Divider, Spin } from "antd";
import axios from "axios";
import React from "react";
import AddSetting from "./AddSetting";
import { useSelector } from "react-redux";
import AddDeviceSetting from "./AddDeviceSetting";

const Mydata = myd => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    function refreshPage() {
        window.location.reload();
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onFinish = values => {
        if (values.password === "888888") {
            axios
                .put("/gateway/config/edit", {
                    config_key: values.config_key,
                    value: values.value,
                })
                .then(res => {
                    res.status === 200
                        ? message.success("Device Setting Updated Successfully") && refreshPage() && setIsModalVisible(false)
                        : message.error("Opps! Something went wrong");
                })
                .catch(function (error) {
                    console.log(error);
                    message.error("Backed Server not responding");
                });
        } else {
            message.error("Password is incorrect");
        }
    };
    const onFinishFailed = errorInfo => {
        console.log("Failed:", errorInfo);
        message.error("Opps! Something went wrong");
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Edit
            </Button>
            <Modal title="Edit Device Setting" visible={isModalVisible} closable={false} footer={null}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={myd.myd}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Device Value"
                        name="value"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Phone No!",
                            },
                        ]}
                    >
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item
                        // label="Config Key"
                        name="config_key"
                    >
                        {/* <Input disabled={true}/> */}
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password maxLength={6} />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ align: "center" }}>
                            <Button type="primary"
                                // onClick={refreshPage} 
                                htmlType="submit" style={{ backgroundColor: "green" }}>
                                Submit
                            </Button>
                            <Button onClick={handleCancel} type="primary" style={{ backgroundColor: "red" }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const DeviceSetting = () => {
    const [data, setData] = useState();
    const [last_index, setLastIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const escalatorsData = useSelector(state => state.stationDataReducer.escalators);

    const columns = [

        {
            title: "Device Key",
            dataIndex: "config_key",
            key: "config_key",
            columnWidth: "40%",
            align: "center",
        },
        {
            title: "Device Value",
            dataIndex: "value",
            key: "value",
            columnWidth: "20%",
            align: "center",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "x",
            columnWidth: "20%",
            align: "center",
            render: (record, index) => <Mydata myd={record} />,
        },
    ];
    useEffect(() => {
        axios({
            method: "GET",
            url: `/gateway/config/show`,
        })
            .then(res => {
                const listData = [];
                res.data.map(kdata => {
                    if (kdata.config_key.includes("Device_Name")) {
                        listData.push({
                            id: kdata.id,
                            value: kdata.value,
                            config_key: kdata.config_key,

                        });
                    }
                });
                // to get last mobile no details
                const last = listData[listData?.length - 1];
                const aa = last?.config_key.split('_');
                const lastindex = aa[aa.length - 1]
                setLastIndex(lastindex)
                setData(listData);
                setLoading(false);
            })
            .catch(err => {
                console.warn(err);
                try {
                    message.error("Network Error");
                } catch (error1) {
                    message.error("Backend server not responding");
                }
            });
    }, []);
    return (
        <>
            <div style={{ marginTop:"10px", marginLeft:"10px"}}><AddDeviceSetting lastindex={ parseInt(last_index)}/></div>
            <Divider />
            {loading ? <Space size="large" /> : <Table columns={columns} dataSource={data} bordered />}
        </>
    );
};
export default DeviceSetting;
