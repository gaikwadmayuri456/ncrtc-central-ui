import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Space,Switch } from 'antd';
import axios from 'axios';

const AddSetting = ({ lastindex }) => {
  console.log(lastindex)
  const [isModalOpen, setIsModalOpen] = useState(false);

  function refreshPage() {
    window.location.reload();
  }
  const onFinish = (values) => {
    axios.post("/sms_mobile_number/add_mobile_number", {
      // "enable":values.enable,
      "enable":true,
      "mobile_number":values.mobile_number,
      "name":values.name,
      "priority":values.priority,
      "includes_zones":"all",
      "excluded_zones":""
     })
      .then((res) => {
        res.status === 200
          ? message.success("Mobile number added successfully") && refreshPage() && setIsModalOpen(false)
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
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Mobile No
      </Button>
      <Modal title="Add Mobile Number" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
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
            label="Name"
            name="name"
            // initialValue={"METRO_SMS_NUMBER_" + (Number(lastindex) + 1)}
            rules={[
              {
                required: true,
                message: 'Please input your Config key',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Name"
            name="enable"
           
            rules={[
              {
                required: true,
                message: 'Please input your Config key',
              },
            ]}
          >
            <Switch size="large"  />
          </Form.Item> */}
          <Form.Item >
            <Form.Item
              label="Mobile Number"
              name="mobile_number"
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
export default AddSetting