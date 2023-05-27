import react, { useEffect, useState } from "react";
import { Table, message, Modal, Button, Form, Input, Space, Divider, Spin, Switch } from "antd";
import axios from "axios";
import React from "react";
import AddSetting from "./AddSetting";

const Mydata = myd => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };
    function refreshPage() {
        window.location.reload();
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };
    const onFinish = values => {
        if (values.password === "888888") {
            axios
                .put(`sms_mobile_number/modify_sms_details?mob_id=${myd?.myd?.id}`, {
                    mobile_number: values.mobile_number,
                    name: values.name,
                    enable: true
                })
                .then(res => {
                    res.status === 200
                        ? message.success("Contact No Updated Successfully") && refreshPage() && setIsModalVisible(false)
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
    const onDeleteFinish = values => {
        if (values.password === "888888") {
            axios
                .delete(`sms_mobile_number/delete_mobile_number?mob_id=${myd?.myd?.id}`)
                .then(res => {
                    res.status === 200
                        ? message.success("Contact No Deleted Successfully") && refreshPage() && setIsDeleteModalVisible(false)
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
            <Space>
                <Button type="primary" onClick={showModal}>
                    Edit
                </Button>
                <Button type="danger" onClick={showDeleteModal}>Delete</Button>
            </Space>
            <Modal title="Edit Mobile Number" visible={isModalVisible} closable={false} footer={null}>
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
                        label="Name"
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mobile No"
                        name="mobile_number"
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
            <Modal title="Delete Mobile Number" visible={isDeleteModalVisible} closable={false} footer={null}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={myd.myd}
                    onFinish={onDeleteFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Mobile No"
                        name="mobile_number"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Phone No!",
                            },
                        ]}
                    >
                        <Input maxLength={10} disabled />
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
                                htmlType="submit" style={{ backgroundColor: "green" }}>
                                Delete
                            </Button>
                            <Button onClick={handleDeleteCancel} type="primary" style={{ backgroundColor: "red" }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const SettingList = () => {
    const [data, setData] = useState([]);
    const [last_index, setLastIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const columns = [
        // {
        //     title: "ID",
        //     dataIndex: "id",
        //     key: "id",
        //     columnWidth: "10%",
        //     align: "center",
        // },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            // render: text => text.split("_").join(" "),
            columnWidth: "40%",
            align: "center",
        },
        {
            title: "Number",
            dataIndex: "mobile_number",
            key: "mobile_number",
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
            url: `/sms_mobile_number/show_numbers`,
        })
            .then(res => {
                // const listData = [];
                // res.data.map(kdata => {
                //     if (kdata.config_key.includes("METRO_SMS_NUMBER")) {
                //         listData.push({
                //             id: kdata.id,
                //             value: kdata.value,
                //             config_key: kdata.config_key,
                //             value2: kdata.value2,
                //             type: kdata.type,
                //         });
                //     }
                // });
                // to get last mobile no details
                // const last=listData[listData?.length-1];
                // const aa=last?.config_key.split('_');
                // const lastindex=aa[aa.length-1]
                // setLastIndex(lastindex)
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                try {
                    message.error("Network Error");
                } catch (error1) {
                    message.error("Backend server not responding");
                }
            });
    }, []);
    return (
        <>
            <div style={{ marginTop: "10px", marginLeft: "10px" }}><AddSetting lastindex={parseInt(last_index)} /></div>
            <Divider />
            {loading ? <Space size="large" /> : <Table columns={columns} dataSource={data} bordered />}
        </>
    );
};
export default SettingList;
