import axios from 'axios';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase.init';
import { AuthContext } from './AuthContext';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

    const[ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const [ role, setRole ] = useState( null );

    const registerUser = ( email, password ) => {
        setLoading( true );
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = ( email, password ) => {
        setLoading( true );
        return signInWithEmailAndPassword( auth, email, password )
    }

    const signInGoogle = () => {
        setLoading( true );
        return signInWithPopup( auth, googleProvider )
    }

    const logOut = () => {
        setLoading( true );
        return signOut( auth );
    }

    const updateUserProfile = ( profile ) => {
        return updateProfile( auth.currentUser, profile )
    }

    // OBSERVE USER STATE -->

    useEffect(( ) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading( false );
        })
        return () => {
            unsubscribe();
        }

    }, [])

    // FETCH USER ROLE
    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => {
                    setRole(res.data.role);
                })
                .catch(err => {
                    console.log(err);
                    setRole('user'); // default to user
                })
        } else {
            setRole(null);
        }
    }, [user])

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile,
        role,
        isAdmin: role === 'admin'
        

        
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;

