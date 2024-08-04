import { useContext, useEffect, useState } from "react";
import "@fontsource/roboto/400.css";
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AppContext } from "../AppContext";
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import { SnackbarProvider, useSnackbar } from 'notistack';

const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(3, 'First Name is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password is a required field')
})

export const LoginSignup = () => {

    const [loginVisible, setLoginVisible] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');
    const navigate = useNavigate();
    const { cookies, setCookie, baseBackendRoute } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const handleOpenSnackbar = () => {
        setOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const toggleLoginVisibility = () => {
        setLoginVisible(!loginVisible);
    }

    const [signInFormData, setSignInFormData] = useState({
        email: '',
        password: ''
    });

    const [signUpFormData, setSignUpFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [signInFormErrors, setSignInFormErrors] = useState({
        email: '',
        password: ''
    })

    const [signUpFormErrors, setSignUpFormErrors] = useState({
        firstName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInFormData({ ...signInFormData, [name]: value });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpFormData({ ...signUpFormData, [name]: value });
    };


    const handleSignInSubmit = async () => {
        const parsed = signInSchema.safeParse(signInFormData);
        if (!parsed.success) {
            const formErrors = parsed.error.format();
            setSignInFormErrors({
                email: formErrors.email?._errors[0] || '',
                password: formErrors.password?._errors[0] || '',
            })
        }
        else {
            console.log('Form Data: ', parsed.data);
            setSignInFormErrors({
                email: '',
                password: ''
            })

            await axios.post(`${baseBackendRoute}/api/auth/login`, {
                'email': signInFormData?.email,
                'password': signInFormData?.password
            }).then((res) => {
                setCookie('token', res?.data?.jwt_token);
                console.log(res);
                navigate('/home');
            }).catch((err) => {
                setSnackbarErrorMessage(err?.response?.data?.message)
                setOpen(true);
                console.log(err);
            })

        }
    }



    const handleSubmit = async () => {
        const parsed = signUpSchema.safeParse(signUpFormData);
        if (!parsed.success) {
            const formErrors = parsed.error.format();
            setSignUpFormErrors({
                email: formErrors.email?._errors[0] || '',
                firstName: formErrors.firstName?._errors[0] || '',
                password: formErrors.password?._errors[0] || '',
                confirmPassword: formErrors.confirmPassword?._errors[0] || '',
            });
        } else {
            console.log('Form data:', parsed.data);
            setSignUpFormErrors({
                email: '',
                firstName: '',
                password: '',
                confirmPassword: ''
            });

            await axios.post(`${baseBackendRoute}/api/auth/register`, {
                'firstName': signUpFormData?.firstName,
                'lastName': signUpFormData?.lastName,
                'email': signUpFormData?.email,
                'password': signUpFormData?.password
            }).then(async (res) => {
                await setLoginVisible(!loginVisible);
            }).catch((err) => {
                console.log(err);
            })

        }
    };

    useEffect(() => {
    }, [loginVisible])


    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className='relative grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 bg-white rounded-xl w-1/2 h-full w-full sm:mt-8 sm:mb-8 m-8 sm:h-full md:w-1/2 lg:w-1/2 md:h-[90vh] lg:h-[90vh] shadow-2xl'>
                    {
                        loginVisible ?
                            <>
                                <div className='flex items-center justify-center pl-8 pr-8 pt-3'>
                                    <div className="w-full max-w-sm">
                                        <h1 className="text-3xl mt-4 font-extrabold mb-6 text-center " style={{ fontFamily: 'Roboto' }}>
                                            Sign In
                                        </h1>
                                        <div className="w-full max-w-lg">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="email">
                                                        Email
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="abcd@gmail.com"
                                                        value={signInFormData.email}
                                                        onChange={handleSignInChange}
                                                    />
                                                    {signInFormErrors.email && <p className="text-red-500 text-xs italic">{signInFormErrors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="password">
                                                        Password
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        placeholder="******************"
                                                        value={signInFormData.password}
                                                        onChange={handleSignInChange}
                                                    />
                                                    {signInFormErrors.password && <p className="text-red-500 text-xs italic">{signInFormErrors.password}</p>}
                                                </div>
                                            </div>


                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="flex items-center justify-center w-full px-3 ">
                                                    <button
                                                        type="button"
                                                        onClick={handleSignInSubmit}
                                                        className="focus:outline-none mb-4 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2  dark:focus:ring-yellow-900"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className='flex items-center justify-center bg-yellow-400 rounded-br-xl sm:rounded-br-xl  rounded-bl-xl sm:rounded-bl-xl rounded-tl-[120px] sm:rounded-tl-[120px] rounded-tr-[120px] sm:rounded-tr-[120px] md:rounded-tr-xl md:rounded-br-xl lg:rounded-tr-xl lg:rounded-br-xl md:rounded-tl-full md:rounded-bl-full lg:rounded-tl-full lg:rounded-bl-full'>
                                    <div className="text-center p-8">
                                        <h1 className="text-3xl font-bold mb-4 text-white">Welcome</h1>
                                        <p className="text-lg font-semibold text-white">New here ? Create account now !</p>

                                        <button type="button" class="mt-4 text-white border border-white font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2" onClick={toggleLoginVisibility}>Register now</button>
                                    </div>
                                </div>


                            </>
                            :
                            <>
                                <div className='flex items-center justify-center bg-yellow-400 rounded-tr-xl sm:rounded-tr-xl  rounded-tl-xl sm:rounded-tl-xl rounded-bl-[120px] sm:rounded-bl-[120px] rounded-br-[120px] sm:rounded-br-[120px] md:rounded-tl-xl md:rounded-bl-xl lg:rounded-tl-xl lg:rounded-bl-xl md:rounded-tr-full md:rounded-br-full lg:rounded-tr-full lg:rounded-br-full'>
                                    <div className="text-center p-8">
                                        <h1 className="text-3xl font-bold mb-4 text-white">Welcome Back</h1>
                                        <p className="text-lg font-semibold text-white">Already have an account.</p>
                                        <button type="button" class="mt-4 text-white border border-white font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2" onClick={toggleLoginVisibility}>Login now</button>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center pl-8 pr-8 pt-3'>
                                    <div className="w-full max-w-sm">
                                        <h1 className="text-3xl font-extrabold mb-6 text-center " style={{ fontFamily: 'Roboto' }}>
                                            Sign Up
                                        </h1>
                                        <div className="w-full max-w-lg">
                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="firstName">
                                                        First Name
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border rounded py-2 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        placeholder="Jane"
                                                        value={signUpFormData.firstName}
                                                        onChange={handleChange}
                                                    />
                                                    {signUpFormErrors.firstName && <p className="text-red-500 text-xs italic">{signUpFormErrors.firstName}</p>}
                                                </div>
                                                <div className="w-full md:w-1/2 px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="lastName">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        placeholder="Doe"
                                                        value={signUpFormData.lastName}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="email">
                                                        Email
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="abcd@gmail.com"
                                                        value={signUpFormData.email}
                                                        onChange={handleChange}
                                                    />
                                                    {signUpFormErrors.email && <p className="text-red-500 text-xs italic">{signUpFormErrors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="password">
                                                        Password
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        placeholder="******************"
                                                        value={signUpFormData.password}
                                                        onChange={handleChange}
                                                    />
                                                    {signUpFormErrors.password && <p className="text-red-500 text-xs italic">{signUpFormErrors.password}</p>}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="w-full px-3">
                                                    <label className="block uppercase tracking-wide text-xs font-bold mb-2" htmlFor="confirmPassword">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        placeholder="******************"
                                                        value={signUpFormData.confirmPassword}
                                                        onChange={handleChange}
                                                    />
                                                    {signUpFormErrors.confirmPassword && <p className="text-red-500 text-xs italic">{signUpFormErrors.confirmPassword}</p>}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap -mx-3 mb-2">
                                                <div className="flex items-center justify-center w-full px-3 ">
                                                    <button
                                                        type="button"
                                                        onClick={handleSubmit}
                                                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-4  dark:focus:ring-yellow-900"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>

            <SnackbarProvider maxSnack={3} >
                <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} TransitionComponent={SlideTransition} onClose={handleSnackbarClose}>
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbarErrorMessage}
                    </Alert>
                </Snackbar>
            </SnackbarProvider>
        </>
    );
};
