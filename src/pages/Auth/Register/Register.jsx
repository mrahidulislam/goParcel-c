import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { NavLink, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    console.log( 'Location From Registration', location );

    const handleRegistration = (data) => {

        console.log('After Registration : ', data.photo[0]);
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(result => {
                console.log(result.user);

                // Store The Image And Get The Data -->
                const formData = new FormData();
                formData.append('image', profileImg);

                // Send The Photo And Get The URL -->
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`


                axios.post(image_API_URL, formData)
                    .then(res => {
                        console.log(" After Image Upload", res.data.data.url);

                        // Update User Profile To Firebase -->
                        const userProfile = {
                            displayName : data.name,
                            photoURL : res.data.data.url,
                        }
                        updateUserProfile( userProfile )
                            .then( () => {
                                console.log('user Profile Updated Done!');
                                navigate( location.state || '/' );
                            })
                            .catch ( error => 
                                console.log(error)
                            )
                    })

            })
            .catch(error => {
                console.log(error);
            })
    }


    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">

            <h3 className="text-3xl text-center font-bold">
                Welcome To Go Parcel
            </h3>
            <p className="text-center">Please Register</p>


            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset">

                    {/* NAME FIELD  */}
                    <label className="label">Name</label>
                    <input type="text" {...register('name',
                        {
                            required: true,
                        }
                    )} className="input" placeholder="Your Name" />

                    {errors.name?.type === 'required'
                        && <p className='text-red-500'> Name Is Required. </p>
                    }
                    {/* PHOTO FIELD  */}
                    <label className="label">Photo</label>

                    <input type="file" {...register('photo',
                        {
                            required: true,
                        }
                    )} className="file-input" placeholder="Your Photo" />

                    {errors.name?.type === 'required'
                        && <p className='text-red-500'> Photo Is Required. </p>
                    }

                    {/* EMAIL FIELD  */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email',
                        {
                            required: true,
                        }
                    )} className="input" placeholder="Email" />

                    {errors.email?.type === 'required'
                        && <p className='text-red-500'> Email Is Required. </p>
                    }

                    {/* PASSWORD FIELD...... */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password',
                        {
                            required: true,
                            minLength: 6,
                            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

                        }
                    )} className="input" placeholder="Password" />

                    {
                        errors.password?.type === 'required'
                        && <p className='text-red-500'> Password Required To Register. </p>
                    }

                    {
                        errors.password?.type === 'minLength'
                        && <p className='text-red-500'> Password Must Be 6 Character Or Longer. </p>
                    }
                    {
                        errors.password?.type === 'pattern'
                        && <p className='text-red-500'> Password Must Have At Least One Uppercase, At Least One Lowercase, At Least One Number, And At Least One Special Characters</p>
                    }

                    {/* <div>
                        <a className="link link-hover">Forgot password?</a>
                    </div> */}

                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>

                <p> Already Have An Account? <NavLink
                 state={ location.state }
                 to="/login" 
                 className="text-blue-500 font-bold underline">Login</NavLink> </p>

            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;