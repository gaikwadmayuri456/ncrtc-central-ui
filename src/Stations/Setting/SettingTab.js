import React from 'react'
import { Tabs } from 'antd';
import SettingList from './Setting';
import SMSLogs from './SMSLogs';
const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: `Contact Details`,
      children: <><SettingList/></>,
    },
    {
      key: '2',
      label: `SMS Logs`,
      children: <><SMSLogs/></>,
    },
    // {
    //   key: '3',
    //   label: `Tab 3`,
    //   children: `Content of Tab Pane 3`,
    // },
  ];
function SettingTab() {
  return (
    <div>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}

export default SettingTab