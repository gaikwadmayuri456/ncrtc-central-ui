import { Button, Popover } from 'antd';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
	Col, Descriptions, Form, Input,
	message, Row, Space, Table, Typography,
	Divider, Tag, Image
} from "antd";
import { GetPowerTag, GetSymbolForOneDevice, GetStatus, GetSpeed } from "./Components"
import moment from "moment";
import axios from "axios";
export default function OneEscalator() {
	const { Title } = Typography;
	const deviceCode = useParams().deviceCode;
	const [messageApi, contextHolder] = message.useMessage();
	const stationDataReducer = useSelector(state => state.stationDataReducer);
	const deviceData = stationDataReducer?.escalators?.find(device => device.device_code === deviceCode);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const columns = [
		{
			title: "Error Code",
			dataIndex: "zone",
			key: "zone",
			width: "30px",
			align: "center",
		},
		{
			title: "Name",
			dataIndex: "add_",
			key: "add_",
			width: "30px",
			align: "center",
		},
		{
			title: "Event Occurred At",
			dataIndex: "start_time",
			key: "start_time",
			width: "30px",
			align: "center",
			render: record => moment(record).format("DD-MM-YYYY hh:mm:ss"),
		},
		{
			title: "Duration",
			dataIndex: "duration_seconds",
			key: "duration_seconds",
			width: "30px",
			align: "center",
			render: record => record + "S"
		},
	];

	// egress off command

	var egress_zone = ""
	if (localStorage.getItem(deviceCode) === 'EGRESS_UP') {
		egress_zone = "IOOUT3"
	}
	else{
		egress_zone = "IOOUT4"
	}
	const onFinish = values => {
		const success = () => {
			messageApi.open({
				type: 'success',
				content: 'This is a prompt message for success, and it will disappear in 10 seconds',
				duration: 10,
			});
		};

		if (values.password === "888888") {
			setButtonDisabled(false);
			message.success({
				type: 'success',
				content: 'Override buttons are enabled',
				duration: 10,
			})
			success()
		} else {
			setButtonDisabled(true);
			message.error("Failure")
		}
	};
	const [msg, setMsg] = useState(
		localStorage.getItem(deviceCode) == null
			? " "
			: 
			localStorage.getItem(deviceCode)
	);
	const content = (
		<div>
			<p>Press ESCALATOR OVERRIDEN button to off escalator Overridden command </p>
		</div>
	);

	return (
		<div style={{ margin: 0, height: "100%", overflow: "hidden" }}>
			<Link to="/stations/123">
				<Button>
					Back
				</Button>
			</Link>
			<>
				<Row>
					<Col span={6}>
						<Image preview={false} src={`../../${deviceData?.g_up_dn_symbol}`} height={250} width={300} />
						{/* <GetSymbolForOneDevice
							status_code={parseInt(deviceData?.status_code)}
							status={deviceData?.status}
							zone={deviceData?.zone}
							image_type="singleview"
							device_code={deviceData?.device_code}
						/> */}
					</Col>
					<Col span={18}>
						<Space>
							<Title level={3}>{`Escalator Name : ${deviceData?.name}` + "           "+ `${deviceData.g_relay_status}`}</Title>
							{/* <Form
								name="basic"
								initialValues={{ remember: true }}
								onFinish={onFinish}
								// onFinishFailed={onFinishFailed}
								autoComplete="off"
								layout="inline"
							>
								<Space>
									<Form.Item
										label="Password"
										name="password"
										style={{ paddingLeft: "30px", marginBottom: "8px", fontWeight: "bold", fontSize: "20px" }}
										rules={[{ required: true, message: "Please input your password!" }]}
									>
										<Input.Password maxLength={6} />
									</Form.Item>
									<Form.Item>
										<Button type="primary" htmlType="submit" style={{ marginBottom: "6px", fontWeight: "bold" }}>
											Submit
										</Button>
									</Form.Item>
								</Space>
							</Form> */}
						</Space>
						<Descriptions
							size="small"
							bordered
							column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
							labelStyle={{ fontWeight: "bold" }}
						>
							<Descriptions.Item label="Power On">
								<Button shape="circle" style={deviceData?.g_Power == "ON" ? { backgroundColor: "Green", color: "white" } : { backgroundColor: "red", color: "white" }} size="large"> {deviceData?.g_Power}</Button>

								{/* {<GetPowerTag status_code={deviceData?.status_code} status={deviceData?.status} />} */}
							</Descriptions.Item>
							<Descriptions.Item label="Status">
								{/* {<GetStatus status_code={deviceData?.status_code} status={deviceData?.status} speed={deviceData?.speed} />} */}
								<Image preview={false} src={`../../${deviceData?.g_status}`} height={50} width={50} />
							</Descriptions.Item>
							<Descriptions.Item label="Speed (m/s)">
								{/* <b>{<GetSpeed status={deviceData?.status} speed={deviceData?.speed + "m/s"} />}</b> */}
								{deviceData?.g_speed}
							</Descriptions.Item>
							<Descriptions.Item label="Fault Time">
								{deviceData?.FAULT ? moment(deviceData?.FAULT).format("hh:mm:ss") : "No Data"}
							</Descriptions.Item>
							<Descriptions.Item label="Error Code">{deviceData?.zone ? deviceData?.zone : "NA"}</Descriptions.Item>
							<Descriptions.Item label="Running Time">
								{moment.utc((deviceData?.total_runtime) * 1000).format("HH:mm:ss")}
							</Descriptions.Item>
							<Descriptions.Item label="Error Message">{deviceData?.add_ ? deviceData?.add_ : "NA"}</Descriptions.Item>
							{/* <Descriptions.Item label="Override Fire" contentStyle={{ width: "175px" }}>
								{
									<Space>
										<tag>
											<Popover title="Detail" content={content}>
												<Button
													disabled={buttonDisabled}
													style={{ backgroundColor: "Green", color: "white", borderRadius: "5px" }}
													type="primary"
													onClick={event => {
														const params = {

															device_code: deviceData?.io_device_code,
															zone: 'IOOUT1',
															// deviceData?.control_output_zone,
															method: "on",
															method_reset_duration: 5,
															options: {},
														};
														axios
															.post("outputs/set", params)
															.then(res => {
																message.success({
																	type: 'success',
																	content: 'System Overriden On',
																	duration: 10,
																});
																var timeoutId = setTimeout(function() { localStorage.removeItem(deviceCode); }, 5000);
																localStorage.setItem(deviceCode, "System Overridden",timeoutId);


																setMsg(localStorage.getItem(deviceCode));

															})
															
															.catch(err => {
																console.log(err);
															});
													}}
												>
													START
												</Button>
											</Popover>
										</tag>
										<tag>
											<Popover title="Detail" content={content}>
												<Button
													disabled={buttonDisabled}
													type="primary"
													style={{ backgroundColor: "Red", color: "white", borderRadius: "5px" }}
													onClick={event => {
														
														const params = {
															device_code: deviceData?.io_device_code,
															zone: deviceData?.control_output_zone,
															method: "off",
															method_reset_duration: 5,
															options: {},
														};
														axios
															.post("outputs/set", params)
															.then(res => {
																message.success({
																	type: 'success',
																	content: 'System Overriden Off',
																	duration: 10,
																});
																localStorage.setItem(deviceCode, "System Overridden"
																);
																localStorage.setItem(deviceCode, " ");
																setMsg(localStorage.getItem(deviceCode));
															})
															
															.catch(err => {
																console.log(err);
															});
													}}
												>
													STOP
												</Button>
											</Popover>
										</tag>
									</Space>
								}
							</Descriptions.Item> */}
							{/* **********  Egress Command********* */}
							<Descriptions.Item label={
							<>
							<Space>
							<Form
								name="basic"
								initialValues={{ remember: true }}
								onFinish={onFinish}
								// onFinishFailed={onFinishFailed}
								autoComplete="off"
								layout="inline"
							>
								<Space>
									<Form.Item
										label="Password"
										name="password"
										// style={{ paddingLeft: "30px", marginBottom: "8px", fontWeight: "bold", fontSize: "20px" }}
										rules={[{ required: true, message: "Please input your password!" }]}
									>
										<Input.Password maxLength={6} />
									</Form.Item>
									<Form.Item>
										<Button type="primary" htmlType="submit" style={{ marginBottom: "6px", fontWeight: "bold" }}>
											Submit
										</Button>
									</Form.Item>
								</Space>
							</Form>
						</Space>
							</>}
							
							
							contentStyle={{ width: "175px" }}>
								{
									<Space>
										
										<Popover title="Detail" content={content}>
												<Button
													disabled={buttonDisabled}
													style={{ backgroundColor: "Green", color: "white", borderRadius: "5px" }}
													type="primary"
													onClick={event => {
														const params = {

															device_code: deviceData?.io_device_code,
															zone: deviceData?.control_output_zone,
															// deviceData?.control_output_zone,
															method: "on",
															method_reset_duration: 25,
															options: {},
														};
														axios
															.post("outputs/set", params)
															.then(res => {
																// setButtonDisabled(true)
																var timeoutId = setTimeout(function() { localStorage.removeItem(deviceCode); }, 25000);
																localStorage.setItem(deviceCode, "Escalator Overridden",timeoutId);
																// setMsg(localStorage.getItem(deviceCode),timeoutId);
																setTimeout(setMsg(localStorage.getItem(deviceCode)), 25000);
																message.success({
																	type: 'success',
																	content: 'Escalator Overridden',
																	duration: 10,
																});
																

															})
															
															.catch(err => {
																console.log(err);
															});
													}}
												>
													 ESCALATOR OVERIDE
												</Button>
											</Popover>
										{/* <Popover title="Detail" content={content}>
											<Button
												disabled={buttonDisabled}
												style={{ backgroundColor: "Green", color: "white", borderRadius: "5px" }}
												type="primary"
												onClick={event => {

													const params = {

														device_code: deviceData?.io_device_code,
														zone: 'IOOUT3',
														method_reset_duration: 5,
														// deviceData?.control_output_zone,
														method: "on",
														options: {},
													};
													axios
														.post("outputs/set", params)
														.then(res => {
															setButtonDisabled(true)
															message.success({
																type: 'success',
																content: 'Egress Command UP ON',
																duration: 10,
															});
															var timeoutId = setTimeout(function() { localStorage.removeItem(deviceCode); }, 10000);
															localStorage.setItem(deviceCode, "EGRESS_UP",timeoutId);
															setTimeout(setMsg(localStorage.getItem(deviceCode)), 10000);

														})

														.catch(err => {
															console.log(err);
														});
												}}
											>
												EGRESS UP
											</Button>
										</Popover>
										<Popover title="Detail" content={content}>
											<Button
												disabled={buttonDisabled}
												style={{ backgroundColor: "Green", color: "white", borderRadius: "5px" }}
												type="primary"
												onClick={event => {
													const params = {

														device_code: deviceData?.io_device_code,
														zone: 'IOOUT4',
														method_reset_duration: 5,
														// deviceData?.control_output_zone,
														method: "on",
														options: {},
													};
													axios
														.post("outputs/set", params)
														.then(res => {
															setButtonDisabled(true)
															message.success({
																type: 'success',
																content: 'Egress Down Command ON',
																duration: 10,
															});
															var timeoutId = setTimeout(function() { localStorage.removeItem(deviceCode); }, 10000);
															localStorage.setItem(deviceCode, "EGRESS_DOWN",timeoutId);
															// setMsg(localStorage.getItem(deviceCode));
															setTimeout(setMsg(localStorage.getItem(deviceCode)), 10000);
															// setTimeout(setMsg(""), 5000);

														})

														.catch(err => {
															console.log(err);
														});
												}}
											>
												EGRESS DOWN
											</Button>
										</Popover>
										<Popover title="Detail" content={content}>
											<Button
												disabled={buttonDisabled}
												type="primary"
												style={{ backgroundColor: "Red", color: "white", borderRadius: "5px" }}
												onClick={event => {
													const params = {
														device_code: deviceData?.io_device_code,
														zone: "IOOUT2",
														// zone: egress_zone,
														method_reset_duration: 5,
														method: "on",
														options: {},
													};
													axios
														.post("outputs/set", params)
														.then(res => {
															setButtonDisabled(true)
															message.success({
																type: 'success',
																content: 'stop relay on',
																duration: 10,
															});
															var timeoutId = setTimeout(function() { localStorage.removeItem(deviceCode); }, 10000);
															localStorage.setItem(deviceCode, "STOP_RELAY_ON",timeoutId);
															setTimeout(setMsg(localStorage.getItem(deviceCode)), 10000);

														})

														.catch(err => {
															console.log(err);
														});
												}}
											>
												STOP
											</Button>
										</Popover> */}
									</Space>
								}
							</Descriptions.Item>

							{/* <Descriptions.Item label="Override Seismic" contentStyle={{ width: "175px" }}>
								{
									<Space>
										<tag>
											<Popover title="Detail" content={content}>
												<Button
													disabled={buttonDisabled}
													style={{ backgroundColor: "Green", color: "white", borderRadius: "5px" }}
													type="primary"
													onClick={event => {
														const params = {
															device_code: deviceData?.io_device_code,
															zone: "IOOUT1",
															method: "on",
															options: "",
														};
														axios
															.post("outputs/set", params)
															.then(res => {
																message.success("Fire Override System On");

															})
															.then((result) => {
																axios.get(`/devices/modbus/status?device_code=${deviceData.io_device_code}`)
																	.then((res) => {
																		const data = res.data
																		console.log(data)
																		let adata = {}
																		data?.inputs?.map((mm) => {
																			adata[mm.tags?.zone] = mm.fields?.value
																		})
																		console.log(adata)
																		if (deviceCode != null) {
																			if (adata['IOIN2'] === 0 || adata['IOIN4'] === 0 || adata['IOIN6'] === 0 || adata['IOIN8'] === 0) {
																				localStorage.setItem(
																					deviceCode,
																					"(Sesmic System Overridden)"
																				);
																				setMsg(localStorage.getItem(deviceCode));
																			}
																		}
																	})

															})
															.catch(err => {
																console.log(err);
															});
													}}
												>
													START
												</Button>
											</Popover>
										</tag>
										<tag>
											<Popover title="Detail" content={content}>
												<Button
													disabled={buttonDisabled}
													type="primary"
													style={{ backgroundColor: "Red", color: "white", borderRadius: "5px" }}
													onClick={event => {
														const params = {
															device_code: deviceData?.io_device_code,
															zone: "IOOUT1",
															method: "off",
															options: "",
														};
														axios
															.post("outputs/set", params)
															.then(res => {
																message.success(" Seismic Override System Off");
															})
															.then((result) => {
																axios.get(`/devices/modbus/status?device_code=${deviceData.io_device_code}`)
																	.then((res) => {
																		const data = res.data
																		console.log(data)
																		let adata = {}
																		data?.inputs?.map((mm) => {
																			adata[mm.tags?.zone] = mm.fields?.value
																		})
																		console.log(adata)
																		if (deviceCode != null) {
																			if (adata['IOIN2'] === 1 || adata['IOIN4'] === 1 || adata['IOIN6'] === 1 || adata['IOIN8'] === 1) {
																				localStorage.removeItem(deviceCode, "");
																				setMsg(localStorage.removeItem(deviceCode));
																			}
																		}
																	})

															})
															.catch(err => {
																// console.log(err);
															});
													}}
												>
													STOP
												</Button>
											</Popover>
										</tag>
									</Space>
								}
							</Descriptions.Item> */}
						</Descriptions>
					</Col>
				</Row>
				{/* <Divider></Divider> */}
				<Title level={4} style={{ marginLeft: "10px" }}>Today's Last Fault</Title>
				{/* <Table
					display="block"
					columns={columns}
					// dataSource={deviceData?.last_5_errors}
					size="middle"
					height="100px"
					pagination={false}
					rowClassName={(record, index) => "rowclass"}
				/> */}
				<table id="customers">
					<tr>
						<th>ERROR Code</th>
						<th>Name</th>
						<th>Event Occurred At</th>
						<th>Duration</th>
					</tr>
					<tr>
						<td> {deviceData?.last_5_errors?.zone}</td>
						<td>{deviceData?.last_5_errors?.add_}</td>
						<td>{moment(deviceData?.last_5_errors?.start_time).format("DD-MM-YYYY hh:mm:ss")}</td>
						<td>{deviceData?.last_5_errors?.duration_seconds} {"s"}</td>
					</tr>
					<tr>
					</tr>
				</table>
				<Divider></Divider>
				<Row>
					<Col span={24}>
						<Title level={4} style={{ marginLeft: "10px" }}>Energy Monitoring</Title><h1></h1>
						<iframe allowtransparency="true" frameBorder="0" style={{ width: "100%", height: "300%", backgroundColor: "#FFFFFF" }} src={axios.defaults.baseURL1 + process.env.REACT_APP_GRAPHANA_BASEURL_DASHBOARD + deviceData?.energy_meter_d_code} />
					</Col>
				</Row>
			</>
		</div>
	)
}
