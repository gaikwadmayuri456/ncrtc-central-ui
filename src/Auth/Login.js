import React from "react";
import { Form, Input, Button, Card, Typography, Avatar, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ar_loginUser } from "../Redux/Actions/AuthActions";

const { Title } = Typography;
const { Meta } = Card;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = (values) => {
        const LoginDetails = {
            username: values.Username,
            password: values.Password,
        };
        // axios
        //   .post("/auth", LoginDetails)
        //   .then((response) => {
        //     localStorage.setItem("JWTtoken", response.data.token);
        //     window.location.href = "/";
        //     try {
        //       window.location.href = history.location.state.from;
        //     } catch (error) {
        //       window.location.href = "/";
        //     }
        //   })
        //   .catch((err) => {
        //     try {
        //       message.error([err.response.data.detail]);
        //     } catch (error1) {
        //       message.error("Backend server not responding");
        //     }
        //   });

        if (values.Username === 'admin' && values.Password === 'admin') {
            localStorage.setItem("LoginStatus", true)
            const data = {
                isLogged: true,
                userId: "DummyUser",
                userName: "DummyName",
            };
            dispatch(ar_loginUser(data));
            window.location.href = "/stations/";

        }
        else {
            message.error("Incorrect Usename and Password")
        }
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };
    const onFormClick = (values) => {
        if (values.Username === 'admin' && values.Password === 'admin') {
            localStorage.setItem(
                "JWTtoken",
                "sha512-UfpWE/VZn0iP50d8cz9NrZLM9lSWhcJ+0Gt/nm4by88UL+J1SiKN8/5dkjMmbEzwL2CAe+67GsegCbIKtbp75A=="
            );
            navigate("/panel");
        }

    };

    return (
        <>
            <div
                style={{
                    height: "100vh",
                    backgroundImage: `url(${process.env.REACT_APP_LOGIN_IMG})`,
                    backgroundColor: "white",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                    textAlign: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        minWidth: "100%",
                        minHeight: "100%",
                        // textAlign: "center",
                        display: "-webkit-flex",
                        // alignItems: "center",

                    }}
                >
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{
                            marginTop: "5%",
                            marginLeft: "75%",
                            width: "400px",
                            height: "250px",
                            backgroundColor: "#EA433A",
                            borderRadius: "15px"

                        }}
                    >
                        <Meta
                            // avatar={<Avatar src="Delhi_Metro_logo.png" />}
                            title={<Title level={3} style={{ color: "white" }}>RRTS Login</Title>}
                        />
                        <br></br>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label={<Title level={5} style={{ color: "white" }}>Username</Title>}
                                name="Username"
                                rules={[
                                    { required: true, message: "Please input your username!" },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label={<Title level={5} style={{ color: "white" }}>Password</Title>}
                                name="Password"
                                rules={[
                                    { required: true, message: "Please input your password!" },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ backgroundColor: "#0F73BA", borderRadius: "5px" }}
                                    onClick={onFormClick}
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
};
export default Login;
