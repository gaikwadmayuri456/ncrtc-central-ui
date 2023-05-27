import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Routes, Route, useLocation, Navigate, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Login from "./Auth/Login";
import { ar_loginUser, ar_logoutUser } from "./Redux/Actions/AuthActions";
import MyNavbar from "./AppLayout/MyNavbar";
import AppLayout from "./AppLayout/AppLayout";
import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import MyPortal from "./Components/MyPortal";
import StationService from "./Stations/OneStation/StationService";
import OneEscalator from "./Stations/OneStation/OneEscalator";
import StationDevicesTable from "./Stations/OneStation/StationDevicesTable";
import StationsMap from "./Stations/StationsMap";
import { BarChartOutlined, TableOutlined, IdcardOutlined } from "@ant-design/icons";
import StationDevicesCard from "./Stations/OneStation/StationDevicesCard"

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const authReducer = useSelector(state => state.authReducer);
    const mdata = useSelector(state => state.stationDataReducer.maintenanceData)
    let location = useLocation();

    const validateToken = () => {
        setLoading(true);
        // if (localStorage.token) {
        //     const token = localStorage.getItem("token");
        //     const decoded = jwt_decode(token);
        //     const currentTime = Date.now() / 1000; // to get in milliseconds
        //     if (currentTime <= decoded.exp) {
        //         const data = {
        //             isAuthenticated: true,
        //             user: {
        //                 userId: decoded.userid,
        //                 username: decoded.username,
        //             },
        //         };
        //         dispatch(ar_loginUser(data));
        //     }
        // }
        if (localStorage.LoginStatus) {
            const data = {
                isAuthenticated: true,
                user: {
                    userId: 1,
                    username: "admin",
                },
            };
            dispatch(ar_loginUser(data));
        }
        // dispatch(ar_loginUser({ isAuthenticated: true, user: {} }));  // Uncomment this line for testing
        setLoading(false);
    }

    useEffect(() => {
        validateToken();
    }, []);

    const menuItems = [
        {
            key: "dashboard",
            label:
                (
                    <Link to="/stations/123/">Dashboard</Link>
                ),
            icon: <AiFillHome />,
            search: "dashboard",
            pathname: "/stations/123/",
            children: [
                {
                    key: "CardView",
                    label:
                        (
                            <Link to="/stations/123/cardview">CardView</Link>
                        ),
                    icon: <IdcardOutlined />,
                },
                {
                    key: "TableView",
                    label:
                        (
                            <Link to="/stations/123/tableview">TableView</Link>
                        ),
                    icon: <TableOutlined />,
                }

            ],
            name: "Dashboard",
        },
        {
            key: "Escalators Reports",
            label:
                (
                    <Link to="/stations/reports">Escalators Reports</Link>
                ),
            icon: <BarChartOutlined />,
            search: "reports",
            pathname: `/stations/reports`,
            name: "Reports",

        },

        {
            label: "Logout",
            key: "logout",
            name: "Logout",
            search: "logout",
            icon: <BiLogOut />,
            style: { marginTop: "5px" },
            onClick: () => {
                dispatch(ar_logoutUser({ isAuthenticated: false, user: {} }));
            },
        },
    ];
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} >
                </Route>
                {/* 
					Validate the token first.
					Till the token is being validated, show the loading screen.
					After that loading will be false, hence check if the validation is successful or not.
					If successful, then move forward.
					Else, naviate to the login page.
				*/}
                <Route
                    path="*"
                    element={
                        loading ? <div>Loading...</div>
                            : authReducer.isAuthenticated
                                ?
                                <>
                                    <AppLayout menuItems={menuItems} />
                                </>
                                : <Navigate
                                    to="/login"
                                    replace={true}
                                    state={{ from: location.pathname }}
                                />
                    }
                >
                    {/* All Authenticated Routes here ............ */}

                    <Route path="stations" element={<Outlet />} >
                        {/* /stations/stationId */}
                        <Route
                            path=":stationId"
                            element={
                                <>
                                    <Outlet />
                                    <StationService />
                                </>
                            }
                        >

                            {/* /stations/stationId/deviceCode */}
                            <Route path=":deviceCode" element={<OneEscalator />} />

                            {/* /stations/stationId */}
                            <Route path="tableview" element={<StationDevicesTable />} />
                            <Route path="cardview" element={<StationDevicesCard />} />
                        </Route>

                        {/* /stations */}
                        <Route path="" element={<StationsMap />} />
                    </Route>
                    <Route path="abc" element={
                        <>
                            <h1>/abc Page</h1>
                            <MyPortal id="navbar-portal">ABC Page | Shlok OP</MyPortal>
                        </>
                    } />
                    <Route path="*" element={<Navigate to={"/stations/123"} />} />
                </Route>
            </Routes>
        </div>
    )
}
export default App;
