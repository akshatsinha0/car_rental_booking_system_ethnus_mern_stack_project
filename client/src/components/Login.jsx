import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const {data} = await axios.post(`/api/user/${state}`, {name, email, password})

            if (data.success) {
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
    }

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 dark:text-text-dark bg-black/50 dark:bg-black/70'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 michroma-regular bg-[#F5DEB3]">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary dark:text-secondary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 dark:border-gray-700 rounded w-full p-2 mt-1 outline-primary dark:bg-background-dark dark:text-text-dark" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 dark:border-gray-700 rounded w-full p-2 mt-1 outline-primary dark:bg-background-dark dark:text-text-dark" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <div className="relative">
                  <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 dark:border-gray-700 rounded w-full p-2 mt-1 outline-primary dark:bg-background-dark dark:text-text-dark" type={showPassword ? "text" : "password"} required />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <img src={showPassword ? assets.eye_close_icon : assets.eye_icon} alt="toggle visibility" className="w-7 h-7" />
                  </span>
                </div>
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary dark:text-secondary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary dark:text-secondary cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary dark:bg-secondary hover:bg-blue-800 dark:hover:bg-orange-500 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
