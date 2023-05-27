import UseAnimations from "react-useanimations";
import arrowDown from "react-useanimations/lib/arrowDown";
import arrowUp from "react-useanimations/lib/arrowUp";
import activity from "react-useanimations/lib/activity";
import { Image, Tag ,Space, Button} from "antd";

export const GetPowerTag = ({
    status_code,
    status,
}) => {
    /*
        1) If status_code is < 2000 and status is "NOPOLL" then offline
        2) If status_code is < 2000 and status is "POLL" then online
        3) If status_code is >= 2000 then offline
    */

    if (!status_code || !status) {
        return (
            <Button shape="circle" type="danger" size="large">OFF</Button>
            // <Tag color="var(--offlineTagColor)" style={{ padding: "5px 5px 7px 10px ", width: "55px", fontSize: "18px", borderRadius: "5px" }}>
            //     OFF
            // </Tag>
        )
    }

    if (status_code >= 2000) {
        return (
            // <Tag color="var(--offlineTagColor)" style={{ padding: "5px 5px 7px 10px ", width: "55px", fontSize: "18px", borderRadius: "5px" }}>
            //     OFF
            // </Tag>
            <Button  shape="circle" type="danger" size="large">OFF</Button>
        )
    }

    if (status_code < 2000 && status === "NOPOLL") {
        return (
            // <Tag color="var(--offlineTagColor)" style={{ padding: "5px 5px 7px 5px ", width: "55px", fontSize: "18px", borderRadius: "5px", textAlign: "center" }}>
            //     OFF
            // </Tag>
            <Button  shape="circle" style={{backgroundColor:"green"}}type="danger" size="large">OFF</Button>
        )
    }
    else {
        return (
            // <Tag color="var(--onlineTagColor)" style={{ padding: "5px 5px 7px 12px ", width: "55px", fontSize: "18px", borderRadius: "5px" }}>
            //     ON
            // </Tag>
            <Button shape="circle"  style={{backgroundColor: "Green", color: "white"}}size="large">ON</Button>
        )
    }

    return <></>;
}

export const GetSymbol = ({
    status_code,
    status,
    zone,
    device_code,

}) => {
    var imageUrl = "/power_off.png";

    // if status code is > 2000 then offline
    if (!status_code || !status || status_code >= 2000) {
        imageUrl = "/power_off.png";
    }

    // if less than 2000
    else {
        if (localStorage.getItem(device_code) === ' (System Overridden)') {
            return (
                <Tag color="#f50" style={{ width: "95%", fontSize: "13px" }}>
                    Third party<br></br>
                    start override<br></br>
                    switch On</Tag>
            )
        }

        else if (status === "NOPOLL") {
            imageUrl = "/power_off.png";
        }
        else if (status === "UP") {
            imageUrl = "/Escalator_Up.gif";
        }
        else if (status === "DOWN") {
            imageUrl = "/Escalator_Down.gif";
        }
        else if (status === "UM" && zone === "E57") {
            imageUrl = "/um.png";
        }
        else if (status === "FAULT") {
            if (zone === "E14") {
                imageUrl = "/emergency_stop.png";
            }
            else if (zone === "E107") {
                imageUrl = "/fire-element.png";
            }
            else if (zone === "ED1" || zone === "E1A") {
                imageUrl = "/fire-element.png";
            }
            else if (zone === "E53") {
                imageUrl = "/seismic_zone.png";
            }
            else {
                imageUrl = "/fault.png";
            }
        }
        else if (status === "RTS") {
            imageUrl = "/rts.png";
        }
    }

    return (
        <Image className='table-symbol-img' style={{ height: "80px", width: "100px", borderRadius: "10px" }} src={imageUrl} preview={false} />
    )
}
// This function for single device data
export const GetSymbolForOneDevice = ({
    status_code,
    status,
    zone,
    device_code,

}) => {
    var imageUrl = "/power_off.png";

    // if status code is > 2000 then offline
    if (!status_code || !status || status_code >= 2000) {
        imageUrl = "/power_off.png";
    }

    // if less than 2000
    else {
        if (localStorage.getItem(device_code) === ' (System Overridden)') {
            return (
                <Tag color="#f50" style={{ width: "50%", fontSize: "20px" }}>Third party
                    start override
                    <br></br>switch On</Tag>
            )
        }
        if (status === "NOPOLL") {
            imageUrl = "/power_off.png";
        }
        else if (status === "UP") {
            imageUrl = "/Escalator_Up.gif";
        }
        else if (status === "DOWN") {
            imageUrl = "/Escalator_Down.gif";
        }
        else if (status === "UM" && zone === "E57") {
            imageUrl = "/um.png";
        }
        else if (status === "FAULT") {
            if (zone === "E14") {
                imageUrl = "/emergency_stop.png";
            }
            else if (zone === "E107") {
                imageUrl = "/fire-element.png";
            }
            else if (zone === "ED1" || zone === "E1A") {
                imageUrl = "/fire-element.png";
            }
            else if (zone === "E53") {
                imageUrl = "/seismic_zone.png";
            }
            else {
                imageUrl = "/fault.png";
            }
        }
        else if (status === "RTS") {
            imageUrl = "/rts.png";
        }
    }

    return (
        <Image className='table-symbol-img' style={{ width: "300px", height: "250px", marginLeft: "40px", borderRadius: "10px", marginTop: "20px" }} src={imageUrl} preview={false} />
    )
}
export const GetStatus = ({
    status_code,
    status,
    speed,
}) => {
    var animationColor = "green";
    if (speed === 0) {
        animationColor = "orange";
    }
    function showArrow() 
    {
    var G_speed="";
if(speed === 0 || speed == "")
{
    G_speed=0
}
else if(speed >=0.6)
{
    G_speed=3
}
else if(speed>=0.4 && speed<0.6)
{
    G_speed=2
}
else if(speed>=0.01 && speed<0.4)
{
    G_speed=1
}
else
{
    G_speed="NA"
}
    var imgurl = ""
      
        
        if (status === "UP" && G_speed == 3) {
            imgurl = "uparrowhigh.gif"
        }
        else if (status === "UP" && G_speed == 2) {
            imgurl = "uparrowslow.gif"
        }
        else if (status === "UP" && G_speed == 1) {
            imgurl = "uparrowlow.gif"
        }
        else if (status === "DOWN" && G_speed == 3) {
            imgurl = "downarrowhigh.gif"
        }
        else if (status === "DOWN" && G_speed == 2) {
            imgurl = "downarrowslow.gif"
        }
        else if (status === "DOWN" && G_speed == 1) {
            imgurl = "downarrowlow.gif"
        }
        else {
            imgurl = "NA.png"
        }
        return (
            <Image preview={false} src={`../../${imgurl}`} height={50} width={50} alt="Italian Trulli" />
        )
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Space>
                {/* {status_code < 2000 ? status : "-"} */}
                {status_code < 2000 ? showArrow() : "-"}
            </Space>
        </div>
    )

}

export const GetSpeed = ({
    speed,
    status,
    status_code
}) => {
var G_speed="";
if(speed === 0|| speed== "")
{
    G_speed=0
}
else if(speed >=0.6)
{
    G_speed=3
}
else if(speed>=0.4 && speed<0.6)
{
    G_speed=2
}
else if(speed>=0.01 && speed<0.4)
{
    G_speed=1
}
else
{
    G_speed = 1000
}
var showSpeed = "NA";
    if (status_code > 2000) {
        showSpeed = "NA";
    }
    else {
        if ( G_speed === 3) {
            showSpeed = "0.65"
        }
        else if (G_speed === 2) {
            showSpeed = "0.5";
        }
        else if (G_speed === 1) {
            showSpeed = "0.25";
        }
        else  if (G_speed===0){

            showSpeed = "NA";
        }

        if (status !== "UP" && status !== "DOWN") {
            showSpeed = "NA";
        }
    }
    return showSpeed;
}