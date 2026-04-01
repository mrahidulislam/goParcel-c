import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import AboutUs from "../pages/AboutUs/AboutUs";
import Admin from "../pages/Admin/Admin";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/register/register";
import BeARider from "../pages/BeARider/BeARider";
import Coverage from "../pages/Coverage/Coverage";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home/Home";
import Rider from "../pages/Rider/Rider";
import SendParcel from "../pages/SendParcel/SendParcel";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                element: <Home></Home>,
                
            },
            {
                path: '/rider',
                element: <PrivateRoute> <Rider></Rider> </PrivateRoute>
            },
            {
                path: "coverage",
                element: <Coverage></Coverage>,
                loader: () => fetch('/serviceCenter.json').then(res => res.json())
            },
            {
                path:"aboutUs",
                element: <AboutUs></AboutUs>
            },
            {
                path: "rider",
                element: <BeARider></BeARider>
            },
            {
                path: 'send_parcel',
                element: <PrivateRoute>  <SendParcel></SendParcel>  </PrivateRoute>,
                loader: () => fetch('/serviceCenter.json').then(res => res.json())
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayout></AuthLayout>,
        children : [
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register></Register>
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute> <DashboardLayout></DashboardLayout></PrivateRoute>,
        children : [
            {
                path: 'my-parcels',
                element: <MyParcels></MyParcels>
            },
            {
                path: 'payment/:parcelId',
                element: <Payment></Payment>
            },
            {
                path: 'payment-history',
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: 'payment-success',
                element : <PaymentSuccess></PaymentSuccess>
            },
            {
                path: 'payment-cancelled',
                element: <PaymentCancelled></PaymentCancelled>
            },
            {
                path: 'admin',
                element: <AdminRoute> <Admin></Admin> </AdminRoute>
            }
        ]
    }
]);



