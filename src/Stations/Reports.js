import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Col,
  DatePicker,
  Row,
  Select,
  Typography,
  Button,
  Table,
  Spin,
  Divider,
  message,Space
} from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { useReactToPrint } from 'react-to-print';
import { Dropdown} from 'antd';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const Option = Select.Option;
const ZoneWiseWiseReport = () => {
  const componentpDF = useRef()
  const escalatorsData = useSelector(state => state.stationDataReducer.escalators);
  const keyToTime = (key) => {
    var time = moment(key).format(" h:mm:ss a");
    var date = moment(key.substring(0, 10), ["YYYY-MM-DD"]).format("MMM DD");
    return [date, time];
  };
  const date_ = moment(new Date()).format("YYYY-MM-DD");
  const currDate = moment().format("DD-MM-YYYY hh:mm:ss");
  const [currentStation, setCurrentStation] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceData, setDeviceData] = useState(escalatorsData);
  const [bool, setBool] = useState(true);
  const [data, setData] = useState([]);
  const [edata, setEata] = useState([]);
  const [startDate, setStartDate] = useState(date_);
  const [endDate, setEndDate] = useState(date_);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [repData, setRepData] = useState(data);
  const [sheetData, setSheetData] = useState(data);
  const [dates, setDates] = useState(date_);
  const [list, setList] = useState();
  const [listType, setListType] = useState();
  const [faultData, setFaultData] = useState([]);
  const [errorCodes, setErrorCodes] = useState([]);
  const [mystate, setMystate] = useState(false);
  //getting devices list
  // useEffect(() => {
  //   axios({
  //     method: "GET",
  //     url: `/devices/network/listDevices`,
  //   })
  //     .then((res) => {
  //       const listData = [];
  //       res.data.map((kdata) => {
  //         if (kdata.sub_type.includes("ESCL")) {
  //           listData.push(kdata);
  //         }
  //       });
  //       setDeviceData(listData);
  //       setList(res.data[0]?.device_code);
  //       setListType(res.data[0]?.sub_type);
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //     });
  // }, []);

  const onSubmit = () => {
    setIsLoading(true);
    setMystate(true);
    axios({
      method: "GET",
      params: {
        start_time: `${startDate + " " + startTime}`,
        end_time: `${endDate + " " + endTime}`,
        device_code: `${list}`,
        // device_code: `${devicecode}`,
        zone: `${currentStation}`,
        allzones: `${bool}`,
      },
      url: `/report/statechange`,
    })
      .then((res) => {
        try {
          const listData1 = [];
          let i = 1;
          if (bool == true) {
            res.data.map((idata) => {
              if (idata != null) {
                idata.map((ndata) => {
                  // Temp Comment

                  // if(listType==='ESCL485')
                  // {
                  //   ndata.zone = ndata.zone;

                  // }
                  // else{
                  //   ndata.zone = getDisplay(ndata.zone);
                  // }

                  ndata.receive_time = ndata.receive_time;
                  ndata.sortReceive_time = ndata.receive_time;
                  ndata.resolve_time = ndata.resolve_time;
                  ndata.sortResolve_time = ndata.resolve_time;
                  ndata.alarm_time = getFormat(ndata.alarm_time);
                  // mdata.alarm_time = getFormat(mdata.alarm_time);
                  // listData1.push(ndata);
                });
              }
            });

            res.data.map((kdata) => {
              if (kdata != null) {
                kdata.map((mdata) => {
                  mdata.id = i;
                  // mdata.alarm_time = getFormat(mdata.alarm_time);
                  listData1.push(mdata);
                  i++;
                });
              }
            });
            // console.log(10,listData1)
            listData1.sort(custom_sort);
            let abc = [];
            listData1.map((aa) => {
              abc.push(
                {
                  receive_time: JSON.stringify(moment(aa.receive_time)?.format('yyyy-MM-DD h:mm:ss a')),
                  resolve_time: JSON.stringify(moment(aa.resolve_time)?.format('yyyy-MM-DD h:mm:ss a')),
                  zone: aa.zone,
                  name: aa.name,
                  alarm_time: aa.alarm_time
                }
              )
            })
            setEata(abc)
            setRepData(listData1);
            setIsLoading(false);
          } else {
            res.data.map((ndata) => {
              if (ndata != null) {
                // idata.map((ndata) => {
                // ndata.zone = getDisplay(ndata.zone);
                if (listType === 'ESCL485') {
                  ndata.zone = ndata.zone;

                }
                else {
                  ndata.zone = getDisplay(ndata.zone);
                }

                ndata.receive_time = ndata.receive_time;
                ndata.resolve_time = ndata.resolve_time;
                ndata.alarm_time = getFormat(ndata.alarm_time);
                // mdata.alarm_time = getFormat(mdata.alarm_time);
                // listData1.push(ndata);
                // });
              }
            });

            res.data.map((kdata) => {
              if (kdata != null) {
                kdata.id = i;
                // mdata.alarm_time = getFormat(mdata.alarm_time);
                // listData1.sort(custom_sort)
                listData1.push(kdata);
                i++;
              }
            });
            listData1.sort(custom_sort);
            let abc = [];
            listData1.map((aa) => {
              abc.push(
                {
                  receive_time: JSON.stringify(moment(aa.receive_time).format('yyyy-MM-DD h:mm:ss a')),
                  resolve_time: JSON.stringify(moment(aa.resolve_time).format('yyyy-MM-DD h:mm:ss a')),
                  zone: aa.zone,
                  name: aa.name,
                  alarm_time: aa.alarm_time
                }
              )
            })
            setEata(abc)
            setRepData(listData1);
            setIsLoading(false);
          }
        } catch (e) {
          // console.log("Error");
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };
  const handleDeviceChange = (value, key) => {
    setList(value);
    // if (key.key === null) {
    //   // setDeviceId(key.children);
    // }
    // else {
    //   // setDeviceId(key.key);
    // }
    if (value == "ESCL8") {
      const arr = [
        { name: "All", zone: "NA" },
        { name: "Power", zone: "IN1" },
        { name: "UP", zone: "IN2" },
        { name: "Down", zone: "IN3" },
        { name: "Speed", zone: "IN4" },
        { name: "Under Fault", zone: "IN5" },
        { name: "Under Maintenance", zone: "IN6" },
        { name: "Emergency", zone: "IN7" },
        { name: "Fire", zone: "IN8" },
      ];
      setFaultData(arr);
    } else {
      axios({
        method: "GET",
        url: `/generic_input/get_list/${value}`,
      })
        .then((res) => {
          const listData4 = [];
          const listErrorCodes = [];
          listData4.push({ name: "All", zone: "NA" });
          for (var i = 0; i < res.data.length; i++) {
            try {
              let name = res.data[i].name;
              let zone = res.data[i].zone;
              listData4.push({ name: name, zone: zone });
              listErrorCodes.push({ [zone]: name });
              setErrorCodes(listErrorCodes);
            } catch (error) {
              console.log("Error " + error);
            }
          }
          setFaultData(listData4);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  function custom_sort(a, b) {
    return (
      new Date(a.sortReceive_time).getTime() -
      new Date(b.sortReceive_time).getTime()
    );
  }

  // function epoch_to_human(){
  //   return moment(fulldate).format(");

  // }

  const onChange1 = (date) => {
    setStartDate(convert(date[0]._d));
    // console.log(startDate);
    setEndDate(convert(date[1]._d));
    // console.log(endDate);
    setStartTime(date[0]._d.toTimeString().split(" ")[0]); //temp comment
    setEndTime(date[1]._d.toTimeString().split(" ")[0]);
    setDates(convert(date));
  };

  function getDeviceName(deviceCode) {
    let rValue = "";
    for (let i = 0; i < deviceData.length; i++) {
      if (deviceData[i].device_code == deviceCode) {
        rValue = deviceData[i].name;
      }
    }
    return rValue;
  }

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  function onZoneChange(value) {
    // console.log(`selected ${key}`);
    // console.log(`selected ${value}`);
    if (value != "NA" || value != "NA") {
      setBool(false);
    } else {
      setBool(true);
    }
    setCurrentStation(value);
  }

  function getDisplay(a) {
    if (a == "IN1") {
      return "Power";
    } else if (a == "IN2") {
      return "UP";
    } else if (a == "IN3") {
      return "Down";
    } else if (a == "IN4") {
      return "Speed";
    } else if (a == "IN5") {
      return "Under Fault";
    } else if (a == "IN6") {
      return "Under Maintainance";
    } else if (a == "IN7") {
      return "Emergency";
    } else if (a == "IN8") {
      return "Fire";
    } else {
      return "NA";
    }
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current > moment().endOf("day");
  }
  function getFormat(a) {
    if (a < 60) {
      return Math.round(a) + " " + "secs";
    } else if (a > 60 && a < 3600) {
      return Math.round(a / 60) + " " + "mins";

    } else {
      return Math.round(a / 3600) + " " + "hrs";

    }
  }

  const columns1 = [
    {
      title: "Fault Occured Time",
      key: "receive_time",
      dataIndex: "receive_time",
      align: "center",
      // sorter: (a, b) =>
      //   moment(a.receive_time).unix() - moment(b.receive_time).unix(),
      sorter: (a, b) => moment(a.resolve_time).unix() - moment(b.resolve_time).unix(),
      render: (record) => (
        <>
          {/* {record} */}
          {keyToTime(record)}
          {/* {moment(record).format('MMMM Do YYYY, h:mm:ss a')} */}
        </>
      ),
    },
    {
      title: "Fault Resolved Time",
      dataIndex: "resolve_time",
      key: "resolve_time",
      align: "center",
      // sorter: (a, b) =>
      //   moment(a.resolve_time).unix() - moment(b.resolve_time).unix(),
      sorter: (a, b) => moment(a.resolve_time).unix() - moment(b.resolve_time).unix(),
      render: (record) => (
        <>
          {/* {record} */}
          {keyToTime(record)}
          {/* {moment(record).format('MMMM Do YYYY, h:mm:ss a')} */}
        </>
      ),
    },
    {
      title: "Fault Code",
      dataIndex: "zone",
      key: "zone",
      // sorter: true,
      align: "center",
      render: (record) => (
        <>
          {record}
          {/* {getDisplay(record)} */}
        </>
      ),
    },
    {
      title: "Fault Description",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (record) => <>{record}</>,
    },
    {
      title: " Fault Duration",
      dataIndex: "alarm_time",
      key: "alarm_time",
      align: "center",
      render: (record) => (
        <>
          {record}
          {/* {getFormat(record)} */}
        </>
      ),
    },
  ];
  const headers = [
    // { label: "Escalator", key: "id" },
    { label: "Fault occured time", key: "receive_time" },
    { label: "Fault resolved time", key: "resolve_time" },
    { label: "Fault Code", key: "zone" },
    { label: "Fault Description", key: "name" },
    { label: "Fault Duration", key: "alarm_time" },
  ];
  const downloadpdf = useReactToPrint({
    content: () => componentpDF.current,
    documentTitle: getDeviceName(list) + "_" + currDate + ".csv",
    onAfterPrint: () => message.success("PDF Report Saved Successfully")
  })

  const items = [
    {
      key: '1',
      label: (
        <>
          <CSVLink
            data={edata}
            headers={headers}
            separator={","}
            filename={getDeviceName(list) + "_" + currDate + ".csv"}
            target="/Desktop"
          >
            <Button type="primary">Export To Excel</Button>
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
    <>
      <div style={{ marginTop: "26px" }}>
        <Row
          style={{
            margin: 4,
          }}
        >
          <Col span={7}>
            <div
              style={{
                display: "-webkit-flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "5px",
              }}
            >
              <Title

                style={{
                  fontSize: "16px",
                  margin: "10px 15px 10px 10px",
                }}
              >
                Escalator
              </Title>
              <Select
                // value={list != undefined ? getDeviceName(list) : ""}
                placeholder="Select"
                onChange={handleDeviceChange}
                defaultValue={deviceData[0]?.name}
                showSearch
                style={{ width: 300 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {deviceData.map((mdata) => {
                  return (
                    <Option key={mdata.device_code} value={mdata.device_code}>
                      {mdata.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </Col>
          <Col span={7}>
            <div
              style={{
                display: "-webkit-flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "5px",
              }}
            >
              <Title
                level={5}
                style={{
                  margin: "10px 15px 10px 20px",
                }}
              >
                Zone
              </Title>
              <Select
                showSearch
                style={{ width: 350 }}
                defaultValue="All"
                optionFilterProp="children"
                onChange={onZoneChange}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {faultData.map((mdata) => {
                  return (
                    <>
                      <Option key={mdata.name} value={mdata.zone}>
                        {mdata.name}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </div>
          </Col>
          <Col span={7}>
            <div
              style={{
                display: "-webkit-flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "5px",
              }}
            >
              <Space>
                <h3 style={{ fontSize: "16px", margin: "10px", fontWeight: "bold" }}>Date</h3>
                <RangePicker
                  showTime
                  allowClear={false}
                  width={250}
                  disabledDate={disabledDate}
                  defaultValue={[
                    //todo
                    moment(startDate, "YYYY-MM-DD"),
                    moment(endDate, "YYYY-MM-DD"),
                  ]}
                  // disabled={[false, true]}
                  onChange={onChange1}
                />
              </Space>
            </div>
          </Col>
          <Col span={3}>
            <div
              style={{
                display: "-webkit-flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "5px",
              }}
            >
              <Button type="primary" onClick={onSubmit}>
                Submit
              </Button>
              {mystate ? (
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
              ) : (
                <h1></h1>
              )}
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            {!isLoading ? (
              <>
                <div ref={componentpDF}>
                  <Table
                    size="middle"
                    bordered
                    columns={columns1}
                    scroll={{ y: 700 }}
                    // defaultPageSize={10}
                    dataSource={repData}
                    // rowClassName={decideRowColor}
                    pagination={true}
                    rowClassName={(record, index) => "rowclass"}
                    onRow={(record, recordIndex) => ({
                      onClick: (event) => { },
                    })}
                  />
                </div>
              </>
            ) : (
              <div className="loader">
                <Spin size="large" tip="Loading" />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ZoneWiseWiseReport;