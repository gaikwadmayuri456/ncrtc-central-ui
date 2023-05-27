import React from "react";
import { Row, Col, Card, Space, Switch, Button ,Tag, Tooltip,Image} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment/moment";
import { GetPowerTag, GetSymbol, GetStatus, GetSpeed } from "./Components";

function StationDevicesCard() {
    const stationId = useParams().stationId;
    const stationDataReducer = useSelector(state => state.stationDataReducer);
    const escalatorsData = useSelector(state => state.stationDataReducer.escalators);
   return (
        <div>
            <Row className="CardRow">
                {escalatorsData.map(record => {
                    return (
                        <>
                            <Col className="ESC">
                                <Row className={record?.status==="FAULT"||record?.status_code>=2000||record?.status==="NOPOLL"?"ESCROWERR":"ESCROWOK"}>
                                    <Col  className="ESCName">
                                        {" "}
                                        {record?.name}
                                    </Col>
                                    <Col  className="ESCName1">
                                    {record.esc_device_names}
                                        {/* <img src={alert} alt="" style={{ height: "25px", paddingTop: "1px" }} className="Alarm" /> */}
                                    </Col>
                                </Row>
                                <Row className="ESCRow">
                                    <Col span={8} className="ESCCol">
                                        <Row className="Rowc1" style={{ fontWeight: "bold", fontSize: "16px" }}>
                                            Power
                                        </Row>
                                        <Row>
                                        <Button  shape="circle"  style={record.g_Power =="ON"?{backgroundColor: "Green", color: "white"}:{backgroundColor: "red", color: "white"}}  size="large"> {record.g_Power}</Button>
                                            {/* <GetPowerTag
                                                className="Rowc2"
                                                status_code={parseInt(record?.status_code)}
                                                status={record?.status}
                                            /> */}
                                         </Row>
                                       
                                    </Col>
                                    <Col span={8} className="ESCCol">
                                        <Row style={{ fontSize: "16px", fontWeight: "bold" }} className="Scol1">
                                            Status
                                        </Row>
                                        <Row>
                                            {/* If fire or sesmic Overridden switch is on this msg continus on screen untill this Overridden switch stop */}
                                            {
                                            //   <GetSymbol
                                            //      className="Scol2"
                                            //      status_code={parseInt(record?.status_code)}
                                            //      status={record?.status}
                                            //      zone={record?.zone}
                                            //      device_code={record?.device_code}
                                            //  />
                                            <Image preview={false} src={`../../${record.g_up_dn_symbol}`} height={50} width={70}/>
                                            }
                                         </Row>
                                       
                                    </Col>
                                    <Col span={8} className="ESCCol">
                                        <Row className="RCol1" style={{ fontWeight: "bold", fontSize: "16px" }}>
                                            Speed
                                        </Row>
                                        <Row className="RCol2">
                                            { record.g_speed}
                                            {/* <GetSpeed
                                                status_code={parseInt(record?.status_code)}
                                                status={record?.status}
                                                speed={record?.speed}
                                            /> */}
                                        </Row>
                                     
                                    </Col>
                                </Row>
                                <hr />
                                <Row className="ESCROW2">
                                    <Col span={20} className="ESCName1">
                                       <Tooltip title={record?.last_error_name + " "+ record?.last_error_time}>Last Error : {record?.last_error_code}</Tooltip> 
                                    </Col>
                                    <Col span={4} className="ESCName2">
                                        <Link to={`/stations/${stationId}/${record?.device_code}`}>
                                            <Button   className="Viewbtn">
                                                View
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </Col>
                        </>
                    );
                })}
            </Row>
        </div>
    );
}

export default StationDevicesCard;
