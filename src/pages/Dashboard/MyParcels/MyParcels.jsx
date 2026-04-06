import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CiEdit } from 'react-icons/ci';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyParcels = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`)
            return res.data;
        }
    })

    const handleParcelDelete = id => {
        console.log(id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {


                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log(res.data);

                        if (res.data.deletedCount) {
                            //refetch the  data in the ui -->

                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your parcel Request has been deleted.",
                                icon: "success"
                            });
                        }

                    })


            }
        });
    }

    const handlePayment = async( parcel ) => {
        const paymentInfo = {
            cost : parcel.cost,
            parcelId : parcel._id,
            senderEmail : parcel.senderEmail,
            parcelName: parcel.parcelName
        }
        const res = await axiosSecure.post('/payment-checkout-session', paymentInfo);

        console.log( res.data.url ) ;
        window.location.assign(res.data.url);
    }

    return (
        <div>
            <h2>All Of My Parcels : {parcels.length} </h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Payment </th>
                            <th>Delivery Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            parcels.map((parcel, index) => <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <td>{parcel.parcelName}</td>
                                <td>{parcel.cost}</td>
                                <td>
                                    {
                                        parcel.paymentStatus === 'paid' ?
                                            <span className='text-green-500 font-bold '>
                                                Paid
                                            </span>
                                            :

                                            <button onClick={ ()=> handlePayment(parcel)} className="btn btn-primary text-black ">Pay</button>

                                    }
                                </td>
                                <td>{parcel.deliveryStatus}</td>
                                <td>
                                    <button className="btn btn-square hover:bg-primary mx-2">
                                        <FaMagnifyingGlass />
                                    </button>

                                    <button className="btn btn-square hover:bg-primary">
                                        <CiEdit />
                                    </button>

                                    <button
                                        onClick={() => handleParcelDelete(parcel._id)}
                                        className="btn btn-square hover:bg-primary">
                                        <FaRegTrashAlt />
                                    </button>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParcels;