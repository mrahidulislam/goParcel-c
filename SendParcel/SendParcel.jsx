import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const { register, handleSubmit, control } = useForm();

  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const serviceCenters = useLoaderData();
  const regionsDuplicate = serviceCenters.map((c) => c.region);
  const regions = [...new Set(regionsDuplicate)];

  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });

  const districtsByRegion = (region) => {
    const regionDistricts = serviceCenters.filter((c) => c.region === region);
    const districts = regionDistricts.map((d) => d.district);
    return districts;
  };

  const handleSendParcel = (data) => {
    console.log(data);
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;

    const isDocument = data.parcelType === "document";
    const parcelWeight = parseFloat(data.parcelWeight);
    // console.log( sameDistrict );

    let cost = 0;
    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (parcelWeight < 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = parcelWeight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;

        cost = minCharge + extraCharge;
      }
    }

    console.log("Cost Is : ", cost);
    data.cost = cost;

    Swal.fire({
      title: "Agree with the cost?",
      text: `You will be charged ${cost} taka`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm And Continue Payment",
    }).then((result) => {
      if (result.isConfirmed) {
        // SAVE THE PARCEL INFO TO THE DATABASE -->
        axiosSecure.post("/parcels", data).then((res) => {
          console.log("After Saving Parcel: ", res.data);
          if (res.data.insertedId) {
            navigate("/dashboard/my-parcels");
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "parcel has created. Please pay",
              showConfirmButton: false,
              timer: 2500,
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center py-8">Send A Parcel</h1>
      <form
        onSubmit={handleSubmit(handleSendParcel)}
        className="mt-12 p-4 text-black"
      >
        {/* PARCEL TYPE --> */}
        <div>
          <label className="label mr-4 text-black">
            <input
              type="radio"
              {...register("parcelType")}
              value="document"
              className="radio"
              defaultChecked
            />
            Document
          </label>

          <label className="label text-black">
            <input
              type="radio"
              {...register("parcelType")}
              value="non-document"
              className="radio"
            />
            Non-Document
          </label>
        </div>

        {/* PARCEL INFORMATION: NAME, WEIGHT-INFO -->  */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-12 my-8 ">
          <fieldset className="fieldset">
            <label className="label"> Parcel name </label>

            <input
              type="text"
              {...register("parcelName")}
              className="input w-full"
              placeholder="Parcel name"
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="label"> Parcel weight (kg) </label>

            <input
              type="number"
              {...register("parcelWeight")}
              className="input w-full"
              placeholder="Parcel weight"
            />
          </fieldset>
        </div>

        {/* TO COLUMN --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* SENDER DETAILS -->  */}

          <fieldset className="fieldset">
            <h4 className="text-2xl font-bold">Sender Details</h4>

            {/* SENDER NAME --> */}
            <label className="label"> Sender Name </label>

            <input
              type="text"
              {...register("senderName")}
              defaultValue={user?.displayName}
              className="input w-full"
              placeholder="Sender Name"
            />

            {/* SENDER EMAIL --> */}
            <label className="label"> Sender Email </label>

            <input
              type="text"
              {...register("senderEmail", { required: true })}
              defaultValue={user?.email}
              className="input w-full"
              placeholder="Sender Email"
            />

            {/* {
                            errors.senderEmail?.type === 'required' &&
                            <p className='text-red-500'> Email Require For Secure parcel </p>
                        } */}

            {/* SENDER REGION  */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender Regions </legend>

              <select
                {...register("senderRegion")}
                defaultValue="Pick a region"
                className="select"
              >
                <option disabled={true}>Pick a region</option>

                {regions.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* SENDER DISTRICTS -->  */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sender Districts </legend>

              <select
                {...register("senderDistrict")}
                defaultValue="Pick a district"
                className="select"
              >
                <option disabled={true}>Pick a district</option>

                {districtsByRegion(senderRegion).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* SENDER PHONE -->  */}
            <label className="label mt-4"> Sender Phone No </label>

            <input
              type="phone"
              {...register("senderPhone")}
              className="input w-full"
              placeholder="Sender Phone No"
            />

            {/* SENDER PICKUP INSTRUCTION -->  */}
            <label className="label mt-4"> Pickup Instruction </label>

            <textarea
              type="text"
              {...register("pickUp")}
              className="input w-full h-20"
              placeholder="Pickup Instruction"
            />
          </fieldset>

          {/* RECEIVER DETAILS -->  */}

          <fieldset className="fieldset">
            <h4 className="text-2xl font-bold">Receiver Details</h4>

            {/* RECEIVER NAME --> */}
            <label className="label"> Receiver Name </label>

            <input
              type="text"
              {...register("receiverName")}
              className="input w-full"
              placeholder="Receiver Name"
            />

            {/* RECEIVER EMAIL --> */}
            <label className="label"> Receiver Email </label>

            <input
              type="text"
              {...register("receiverEmail")}
              className="input w-full"
              placeholder="Receiver Email"
            />

            {/* RECEIVER REGION --> */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Receiver Regions </legend>

              <select
                {...register("receiverRegion")}
                defaultValue="Pick a region"
                className="select"
              >
                <option disabled={true}>Pick a region</option>

                {regions.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* RECEIVER DISTRICt --> */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Receiver District </legend>

              <select
                {...register("receiverDistrict")}
                defaultValue="Pick a district"
                className="select"
              >
                <option disabled={true}>Pick a district</option>

                {districtsByRegion(receiverRegion).map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </fieldset>

            {/* RECEIVER PHONE -->  */}
            <label className="label mt-4"> Receiver Phone No </label>

            <input
              type="phone"
              {...register("receiverPhone")}
              className="input w-full"
              placeholder="Receiver Phone No"
            />
          </fieldset>
        </div>

        <input
          type="submit"
          className="btn btn-primary text-black mt-8"
          value=" Send parcel "
        />
      </form>
    </div>
  );
};

export default SendParcel;
