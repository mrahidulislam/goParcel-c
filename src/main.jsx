import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";

import './index.css'
import App from './App.jsx'
import { router } from './routes/Router.jsx';
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
/*
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const CompleteDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [] } = useQuery({
        queryKey: ['parcels', user.email, 'driver_assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=parcel_delivered`)
            return res.data;
        }
    });

    const calculatePayout = parcel => {
        if (parcel.senderDistrict === parcel.receiverDistrict) {
            return parcel.cost * 0.8;
        } else {
            return parcel.cost * 0.6;
        }
    };

    return (
        <div>
            <h2 className='text-4xl'>Completed Deliveries: {parcels.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    // head
                    <thead>
                        <tr>
                            <th> No</th>
                            <th>Parcel Name</th>
                            <th>Created At</th>
                            <th>Pickup District</th>
                            <th>Cost</th>
                            <th>Payout</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.createdAt}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td>{parcel.cost}</td>
                                    <td>{calculatePayout(parcel)}</td>
                                    <td>
                                        <button className='btn btn-primary text-black'>
                                            Cash Out
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompleteDeliveries;
*/
