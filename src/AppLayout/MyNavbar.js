import { Layout} from "antd";
import React,{useEffect} from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, Route, Routes } from "react-router-dom";
import useCurrentTime from "../Components/useCurrentTime";
const { Footer } = Layout;


export default function MyNavbar({ collapsed, setCollapse, globalSearchItems }) {
    const currentTime = useCurrentTime(1000); // returns a moment object

    return (
        <Layout>
            <Layout.Header>
                <div className="navbar-component">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: '10px'}}>
                        <span style={{ cursor: "pointer", fontSize: "22px", marginLeft: '5px' }} onClick={() => setCollapse(!collapsed)}>
                            {collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )}
                        </span>
                        <img
                            alt="logo"
                            // src="https://images.smart-iam.com/logo.png"
                            src="../../schindler_logo.png"
                            style={{ height: "80px", height:"40px" ,marginLeft: '0px' }}
                        /><b style={{fontSize:"25px"}}>SAFETRONICS</b> 
                        <span style={{color:"white", fontSize: '20px',marginLeft:"20px"}}>Welcome to {process.env.REACT_APP_STATION_NAME}</span></span>
                    <div style ={{color:"white", fontSize: '20px',marginLeft:"30px"}}>Date: {currentTime.format('DD-MM-YYYY')}</div>
                    <div style ={{color:"white", fontSize: '20px',marginLeft:"30px"}}>Time : {currentTime.format('hh:mm:ss a')}</div>

                    {/* <div id="navbar-portal">
                    </div> */}
                    
                </div>
            </Layout.Header>
            <Layout.Content className="main-content-div">
                {/* {globalReducer?.orgLoading || !globalReducer?.selectedOrg?.orgId ? (
                    <div className="App" style={{textAlign: 'center'}}>
                        <Spin size="large" style={{marginTop: '50px'}} />
                    </div>
                ) : ( */}
                    <Outlet />
                {/* )} */}
            </Layout.Content>
            {/* <Footer style={{ display: "flex", width: "100%", justifyContent: "center", height: "2%", position: "fixed", bottom: "0px", fontWeight: "bold" }}><a href="https://smartiam.in/" target="_blank">Integreted Active Monitoring</a></Footer> */}
         </Layout>
    );
}


