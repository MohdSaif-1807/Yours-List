import { useContext, useEffect, useState } from "react";
import { MdOutlineAddChart } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { BsEmojiGrin } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import { IoAdd } from "react-icons/io5";
import { FaSadCry, FaTasks } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AppContext } from "../AppContext";
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Dashboard = () => {

    const [editId, setEditId] = useState('');
    const [openSidebar, setOpenSidebar] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState('');
    const [openProfile, setOpenProfile] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [categoryName, setCategoryName] = useState();
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState('');
    const [minDate, setMinDate] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [todoCategories, setTodoCategories] = useState([]);
    const [snackbarSeviority, setSnackbarSeviority] = useState('');
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const { cookies, removeCookie, baseBackendRoute } = useContext(AppContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [activeCategory, setActiveCategory] = useState("-1");
    const [mainTaskList, setMainTaskList] = useState([]);
    const [specificCategoryTasks, setSpecificCategoryTasks] = useState([]);
    const [allTodoListCount, setAllTodoListCount] = useState(0);
    const [userInfo, setUserInfo] = useState('');
    const [sessionList, setSessionList] = useState([]);


    const getAllSessions = async () => {
        await axios.get(`${baseBackendRoute}/api/admin/get-all-sessions`)
            .then((res) => {
                setSessionList(res?.data?.data);
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleItemClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const [todoFormSubmit, setTodoFormSubmit] = useState({
        task: '',
        date: '',
        from_time: '',
        to_time: '',
        task_category: ''
    })

    const todoFormChange = (e) => {
        const { name, value } = e.target;
        setTodoFormSubmit({
            ...todoFormSubmit,
            [name]: value
        })
    }

    const handleTodoFormSubmit = async (e) => {
        e.preventDefault();
        setOpenEdit(false);
        await axios.post(`${baseBackendRoute}/api/todo/add-new-task`, {
            'task': todoFormSubmit?.task,
            'task_date': todoFormSubmit?.date,
            'task_from_time': todoFormSubmit?.from_time,
            'task_to_time': todoFormSubmit?.to_time,
            'task_category': todoFormSubmit?.task_category
        }, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            setSnackbarSeviority("success")
            setSnackbarErrorMessage(res?.data?.message);
            setSnackbarOpen(true);
            setOpenTaskModal(false);
            setActiveCategory("-1");
            getAllTodoList();
            getAllTodoCategories();
            getUserInfo();
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleTodoItemEdit = async (e) => {
        const value = e.currentTarget?.id;
        await axios.get(`${baseBackendRoute}/api/todo/get-specific-item/${value}`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            console.log(res);
            setTodoFormSubmit({
                task: res?.data?.data?.task,
                date: res?.data?.data?.task_date?.split("T")[0],
                from_time: res?.data?.data?.task_from_time,
                to_time: res?.data?.data?.task_to_time,
                task_category: res?.data?.data?.task_category
            })
            setOpenEdit(true);
            setEditId(value);
            setOpenTaskModal(true);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleDeleteModalOpen = async (e) => {
        const value = e.currentTarget?.id;
        await axios.get(`${baseBackendRoute}/api/todo/get-specific-item/${value}`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            console.log(res);
            setTodoFormSubmit({
                task: res?.data?.data?.task,
                date: res?.data?.data?.task_date?.split("T")[0],
                from_time: res?.data?.data?.task_from_time,
                to_time: res?.data?.data?.task_to_time,
                task_category: res?.data?.data?.task_category
            })
            setDeleteId(value);
            setDeleteModalOpen(true);
            setActiveCategory("-1");
            getAllTodoList();
        }).catch((err) => {
            console.log(err);
        })

    }


    const getAllTodoList = async () => {
        await axios.get(`${baseBackendRoute}/api/todo/get-todo-items`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            setTaskList(res?.data?.data);
            setMainTaskList(res?.data?.data);
        }).catch((err) => {
            console.log(err);
        })
    }


    const handleSpecificCategoryTasks = async (e) => {
        const value = e.currentTarget?.id;
        if (value !== "All") {
            const filteredData = await mainTaskList?.filter((data) => {
                if (data.task_category === value) {
                    return data;
                }
            })
            await setTaskList(filteredData);
        }
        else {
            await setTaskList(mainTaskList);
        }

    }

    const handleCategoryModal = () => {
        setCategoryName('');
        setOpenModal(!openModal);
    }

    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const handleOpenSnackbar = () => {
        setSnackbarOpen(true);
    };

    const handleDeleteItem = async () => {
        await axios.delete(`${baseBackendRoute}/api/todo/delete-item/${deleteId}`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            console.log(res);
            setSnackbarSeviority("success")
            setSnackbarErrorMessage(res?.data?.message);
            setSnackbarOpen(true);
            setDeleteModalOpen(false);
            getUserInfo();
        }).catch((err) => {
            console.log(err);

        })
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleTaskModal = () => {
        setOpenEdit(false);
        setTodoFormSubmit({
            task: '',
            date: '',
            from_time: '',
            to_time: '',
            task_category: ''
        })
        setOpenTaskModal(true);
    }

    const handleTodoItemEditForm = async (e) => {
        e.preventDefault();
        await axios.put(`${baseBackendRoute}/api/todo/update-details/${editId}`, {
            'task': todoFormSubmit?.task,
            'task_date': todoFormSubmit?.date,
            'task_from_time': todoFormSubmit?.from_time,
            'task_to_time': todoFormSubmit?.to_time,
            'task_category': todoFormSubmit?.task_category
        }, {
            headers: {
                Authorization: cookies.token
            }
        }).then(async (res) => {
            setSnackbarSeviority("success")
            setSnackbarErrorMessage(res?.data?.message);
            setSnackbarOpen(true);
            setOpenTaskModal(false);
        }).then(() => {
            setActiveCategory("-1");
            getAllTodoCategories();
            getAllTodoList();

        }).catch((err) => {
            console.log(err);
        })
    }

    const handleCategoryClick = async () => {
        if (categoryName) {
            console.log(categoryName);
            await axios.post(`${baseBackendRoute}/api/todo/add-new-category`, {
                'todoCategories': categoryName
            }, {
                headers: {
                    Authorization: cookies.token
                }
            }).then(async (res) => {
                setSnackbarSeviority("success")
                setSnackbarErrorMessage(res?.data?.message);
                await setSnackbarOpen(true);
                setOpenModal(false);
                setCategoryName('');
                getAllTodoCategories();
                await getUserInfo();
            })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const handleLogout = async () => {
        await axios.get(`${baseBackendRoute}/api/auth/logout`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            console.log(res);
            removeCookie('token');
            navigate('/');
        }).catch((err) => {
            console.log(err);
        })
    }

    const getAllTodoCategories = async () => {
        await axios.get(`${baseBackendRoute}/api/todo/get-all-task`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            setTodoCategories(res?.data?.data)
        }).catch((err) => {
            console.log(err);
        })
    }

    const getUserInfo = async () => {
        await axios.get(`${baseBackendRoute}/api/auth/user-info`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            setUserInfo(res?.data?.data);
            if (res?.data?.data?.user_role === "admin") {
                getAllSessions();
            }
            else {
                getAllTodoCategories();
                getAllTodoList();
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getSpecificCategoriesTask = async () => {
        await axios.get(`${baseBackendRoute}/api/todo/get-categories-tasks`, {
            headers: {
                Authorization: cookies.token
            }
        }).then((res) => {
            setTaskList(res?.data?.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getUserInfo();
        const today = new Date().toISOString().split('T')[0];
        setMinDate(today);
        if (!cookies.token || cookies.token === undefined) {
            navigate('/');
        }
    }, [])




    return (
        <>
            <nav className="fixed top-0 z-50 bg-white rounded-lg mt-4 m-2 mr-1 border-b border-gray-200 md:w-[99vw] lg:[w-99vw] w-[96vw] mr-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button onClick={() => setOpenSidebar(!openSidebar)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <a href="/" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-extrabold sm:text-3xl whitespace-nowrap text-yellow-400 dark:text-white">YOURS NOTES</span>
                            </a>
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setOpenProfile(!openProfile)}
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center">
                                    <p className="text-yellow-900 font-sm font-bold text-center">{userInfo?.firstName?.charAt(0)}</p>
                                </div>
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-48 ${openProfile ? 'block' : 'hidden'} text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600`} id="dropdown-user">
                                <ul className="py-1">
                                    <li>
                                        <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside
                id="logo-sidebar"
                className={`fixed sm:ml-2 md:ml-2 top-0 left-0 z-40 w-64 h-[80vh] mt-[15vh] pt-4 rounded-lg transition-transform ${openSidebar ? 'ml-2 -translate-x-none' : ''}-translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar"
            >
                <div className="h-full px-2 pb-2  scrollable-hidden overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-1 font-medium">

                        {
                            userInfo?.user_role === "user" ?
                                <>
                                    {
                                        todoCategories.length === 0 && (
                                            <li>
                                                <a className="flex items-center p-2 text-yellow-900 justify-center rounded-lg dark:text-white hover:bg-yellow-100 dark:hover:bg-gray-700 group">
                                                    <span className="ms-2">No Task category found, Add new item from below</span>
                                                </a>
                                            </li>
                                        )
                                    }

                                    {
                                        todoCategories.length !== 0 && (
                                            <>
                                                <li key={"-1"} id="All" onClick={handleSpecificCategoryTasks}>
                                                    <a
                                                        id={"-1"}
                                                        onClick={() => setActiveCategory("-1")}
                                                        className={`flex items-center justify-between p-2 cursor-pointer text-yellow-900 rounded-lg dark:text-white ${activeCategory === "-1" ? 'bg-yellow-200 dark:bg-yellow-900' : 'hover:bg-yellow-100 dark:hover:bg-gray-700'} group`}
                                                    >
                                                        <span className="flex items-center ms-2">All</span>
                                                        <span className="inline-flex items-center border border-yellow-400 justify-center w-8 h-8 p-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                                            {userInfo?.todoListCount}
                                                        </span>
                                                    </a>
                                                </li>
                                                <hr />
                                            </>
                                        )
                                    }

                                    {todoCategories.length !== 0 && todoCategories.map((data, index) => (
                                        <li key={data.id} id={data.todoCategories} onClick={handleSpecificCategoryTasks}>
                                            <a
                                                id={index}
                                                onClick={() => setActiveCategory(index)}
                                                className={`flex items-center justify-between p-2 cursor-pointer text-yellow-900 rounded-lg dark:text-white ${activeCategory === index ? 'bg-yellow-200 dark:bg-yellow-900' : 'hover:bg-yellow-100 dark:hover:bg-gray-700'} group`}
                                            >
                                                <span className="flex items-center ms-2">{data.todoCategories}</span>
                                                <span className="inline-flex items-center border border-yellow-400 justify-center w-8 h-8 p-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                                    {data.count}
                                                </span>
                                            </a>
                                        </li>
                                    ))}

                                    <li
                                        onClick={handleCategoryModal}
                                        className="h-10 flex items-center p-1 rounded-full bg-yellow-100 mt-[10vh] cursor-pointer p-3 hover:bg-yellow-300"
                                        style={{ marginTop: '5vh' }}
                                    >
                                        <IoAdd className="w-6 h-6" />
                                        <span className="ms-2">Create new category</span>
                                    </li>
                                </>
                                :
                                <>
                                    <li key={"session_info"} id={"Session Information"} >
                                        <a
                                            id={"session"}
                                            className={`flex items-center justify-between p-2 cursor-pointer text-yellow-900 rounded-lg dark:text-white ${"session_info" === "session_info" ? 'bg-yellow-200 dark:bg-yellow-900' : 'hover:bg-yellow-100 dark:hover:bg-gray-700'} group`}
                                        >
                                            <span className="flex items-center ms-2">Session Information</span>

                                        </a>
                                    </li>
                                </>
                        }
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64 mt-[10vh]">
                <div className="p-4 dark:border-gray-700">
                    <div id="authentication-modal" tabindex="-1" aria-hidden="true" className={`${openModal ? '' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center w-full h-full`}>
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Add new category
                                    </h3>
                                    <button onClick={() => setOpenModal(!openModal)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="category-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category name</label>
                                            <input type="text" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} name="category-name" id="category-name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Gym" required />
                                        </div>
                                        <button type="submit" onClick={handleCategoryClick} className="w-full text-white bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">Add category</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        userInfo?.user_role === "user" ?

                            <div onClick={handleTaskModal} className="w-auto h-12 bg-yellow-100 cursor-pointer font-semibold hover:text-white hover:bg-yellow-400 rounded-full flex items-center justify-center">
                                <FaTasks className="w-5 h-5 mr-2 transition duration-75" />
                                Create new task
                            </div>
                            :
                            <></>
                    }



                    <div
                        id="popup-modal"
                        tabIndex="-1"
                        className={deleteModalOpen ? "fixed inset-0 z-50 flex items-center justify-center overflow-hidden" : "fixed inset-0 z-50 flex items-center justify-center overflow-hidden hidden"}
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-modal="true"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                                onClick={() => { setDeleteModalOpen(!deleteModalOpen) }}
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg
                                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete the task as follows?
                                </h3>

                                <h4 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
                                    {todoFormSubmit?.task}
                                    <br />
                                    {todoFormSubmit?.from_time} - {todoFormSubmit?.to_time}
                                </h4>

                                <button
                                    onClick={handleDeleteItem}
                                    type="button"
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                >
                                    Yes, I'm sure
                                </button>
                                <button
                                    onClick={() => { setDeleteModalOpen(!deleteModalOpen) }}
                                    type="button"
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>


                    <div id="crud-modal" tabindex="-1" aria-hidden="true" className={`${openTaskModal ? '' : 'hidden'} fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden`}>
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {openEdit ? "Edit the todo item" : "Add new todo item"}
                                    </h3>
                                    <button onClick={() => setOpenTaskModal(!openTaskModal)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <form className="p-4 md:p-5" onSubmit={openEdit ? handleTodoItemEditForm : handleTodoFormSubmit}>
                                    <div className="grid gap-4 mb-4 grid-cols-2">
                                        <div className="col-span-2">
                                            <label htmlFor="task" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task</label>
                                            <input
                                                type="text"
                                                value={todoFormSubmit.task}
                                                onChange={todoFormChange}
                                                name="task"
                                                id="task"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Type Task"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                            <input
                                                type="date"
                                                value={todoFormSubmit.date}
                                                onChange={todoFormChange}
                                                name="date"
                                                id="date"
                                                min={minDate}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                            <label htmlFor="from_time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From Time</label>
                                            <input
                                                type="time"
                                                value={todoFormSubmit.from_time}
                                                onChange={todoFormChange}
                                                name="from_time"
                                                id="from_time"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                            <label htmlFor="to_time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">To Time</label>
                                            <input
                                                type="time"
                                                value={todoFormSubmit.to_time}
                                                onChange={todoFormChange}
                                                name="to_time"
                                                id="to_time"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label htmlFor="task_category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Category</label>
                                            <select
                                                id="task_category"
                                                name="task_category"
                                                value={todoFormSubmit.task_category}
                                                onChange={todoFormChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                required
                                            >
                                                <option value="" disabled>Select category</option>
                                                {todoCategories?.map((data, index) => (
                                                    <option key={index} value={data.todoCategories}>
                                                        {data.todoCategories}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-600 dark:focus:ring-yellow-600"
                                    >
                                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                                        </svg>
                                        {openEdit ? "Update Task" : "Add Task"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className=" p-2 overflow-y-auto h-[70vh] scrollable-hidden">
                        {
                            userInfo?.user_role === "user" && taskList?.map((data, index) => (
                                <div className="flex  w-full h-12 bg-white rounded mb-2 items-center p-2 overflow-x-auto whitespace-nowrap">
                                    <span className="font-semibold text-sm md:text-base">{data.task}</span>

                                    <div className="flex items-center ml-5 md:ml-auto relative inline-block ">
                                        <span className="bg-slate-200 pl-2 text-slate-500 mr-2 text-lg p-1 flex items-center space-x-1 rounded">
                                            <CiClock2 />
                                            <span className="text-slate-500 text-xs md:text-sm pr-2">{data.task_from_time} - {data.task_to_time}</span>
                                        </span>

                                        <span id={data._id} onClick={handleTodoItemEdit}
                                            className="bg-slate-200 text-slate-500 mr-2 text-lg p-1 flex items-center space-x-1 rounded cursor-pointer"
                                        >
                                            <FaRegEdit id={data._id} />
                                        </span>

                                        <span id={data._id} onClick={handleDeleteModalOpen}
                                            className="bg-slate-200 text-slate-500 mr-2 text-lg p-1 flex items-center space-x-1 rounded cursor-pointer"
                                        >
                                            <MdDeleteOutline id={data._id} />
                                        </span>

                                    </div>
                                </div>
                            ))
                        }




                        {userInfo?.user_role === "admin" &&
                            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table class="w-full text-sm text-left rtl:text-right text-yellow-900 dark:text-yellow-900">
                                    <thead class="text-xs text-yellow-900 uppercase bg-yellow-300 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                Session ID
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                IP Address
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Login Time
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Logout Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sessionList?.map((data, index) => (
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-yellow-200 dark:hover:bg-gray-400">
                                                    <td class="px-6 py-4 font-medium text-yellow-900 whitespace-nowrap dark:text-white">
                                                        {data?._id}
                                                    </td>
                                                    <td class="px-6 py-4 font-medium text-yellow-900 whitespace-nowrap dark:text-white">
                                                        {data?.ipAddress}
                                                    </td>
                                                    <td class="px-6 py-4 font-medium text-yellow-900 whitespace-nowrap dark:text-white">

                                                        {data?.loginTime}
                                                    </td>
                                                    <td class="px-6 py-4 font-medium text-yellow-900 whitespace-nowrap dark:text-white">
                                                        {data?.logoutTime}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }





                    </div>


                </div>
            </div>

            <SnackbarProvider maxSnack={3} >
                <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} TransitionComponent={SlideTransition} onClose={handleSnackbarClose}>
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeviority}
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
