import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Modal, Space,Select } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddDeviceSetting = ({ lastindex }) => {
    const stationId = useParams().stationId;
    console.log(lastindex)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceCodes, setDeviceCodes] = useState({
        escalators: undefined,
    });
    const [selectedItems, setSelectedItems] = useState([]);

    const getDeviceTypes = () => {
        axios.get("/gateway/config/show")
            .then((res) => {
                const data = res.data;
                const escalators = data?.filter((d) => d?.config_key === "UI_ESC_device_codes")?.[0]?.value;
                if (!escalators) { console.warn("No escalators found in config") }
                setDeviceCodes(prev => ({
                    ...prev,
                    escalators: escalators,
                }))
            })
            .catch(err => {
                console.log(err);
                // err.handleGlobally && err.handleGlobally();
                message.error("Error Getting Device Types");
            })
    }
    useEffect(() => {
        console.log("StationService useEffect Called", stationId);
        getDeviceTypes();
    }, [stationId]);

    function refreshPage() {
        window.location.reload();
    }
    const onFinish = (values) => {
        axios.post("/gateway/config/add", {
            "config_key": values.config_key,
            "value": values.value
        })
            .then((res) => {
                res.status === 200
                    ? message.success("Device Setting added successfully") && refreshPage() && setIsModalOpen(false)
                    : message.error("Opps! Something went wrong");
            })
            .catch((error) => {
                message.error(error);
            })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    var escSplit = deviceCodes?.escalators?.split(",");
    const filteredOptions = escSplit?.filter((o) => !selectedItems.includes(o));
   return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Device Setting
            </Button>
            <Modal title="Add Device Setting" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Config Key"
                        name="config_key"
                        initialValue={"Please Select Device Names" }
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Config key',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Inserted are removed"
                            value={selectedItems}
                            onChange={setSelectedItems}
                            style={{
                                width: '100%',
                            }}
                            options={filteredOptions?.map((item) => ({
                                value: "Device_Name_" + item,
                                label: "Device_Name_" + item,
                              }))}
                            
                            // options={escSplit?.map((item) => ({
                            //     value:"Device_Name_"+ item,
                            //     label:"Device_Name_"+ item,
                            // }))}
                        />
                    </Form.Item>
                    <Form.Item >
                        <Form.Item
                            label="Device Key Value"
                            name="value"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Mobile No!',
                                },
                            ]}>
                            <Input maxLength={10} />
                        </Form.Item>
                        <Form.Item></Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button type="danger" htmlType="submit" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default AddDeviceSetting