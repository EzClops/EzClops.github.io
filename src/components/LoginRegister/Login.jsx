import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { getUserCart, getAllUsers } from "../../API/apiCalls"


export default function Login({ token, setToken, username, setUsername, password, setPassword, error, setError }){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const min = 5;
    const max = 16;

    const userCartId = 1;
  // setCartPage(true)
  // Grab desired users cart and stores the product and quantity in product state
    useEffect(() => {
        async function fetUserProduct(userId) {
        try {
            const data = await getUserCart(userId);
            const productsInCart = await data["0"]["products"];
            
            if (!localStorage.getItem(`All_Products_In_User_Cart${userId}`)){
                localStorage.setItem(`All_Products_In_User_Cart${userId}`, '[{}]')
            }
            // productsInCart.map((product) => {
            //     if(!localStorage.getItem(`productId:${product["productId"]}[${userId}]`)){
            //         localStorage.setItem(`productId:${product["productId"]}[${userId}]`, JSON.stringify(product["quantity"]))
            //     }
            // }, [])
            // localStorage.setItem("products_In_Cart", JSON.stringify(productsInCart))
        } catch (error) {
            console.error(error.message);
        }
        }
        fetUserProduct(userCartId);
    }, []);

    getAllUsers()
    //Username: mor_2314
    //Password: 83r5^_
    async function handleSubmit(event){
        event.preventDefault();
        try{
            loginValidate(username, password);
            const response = await fetch("https://fakestoreapi.com/auth/login",{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body:JSON.stringify({
                    username: `${username}`,
                    password: `${password}`
                })
            });
            if(!response.ok){
                // console.log(response) 
                setError("Invalid Username or password. Please try again")
                // console.log(error)
                throw new Error("Invalid Username or password. Please try again")
            }
            const result = await response.json();

            sessionStorage.setItem("token", result.token)
            sessionStorage.setItem("username", username)
            setToken(result.token)

            navigate('/')
        }catch(error){
            setError(error.message)
            console.error(error)
        }
    }

    function loginValidate(username, password){
        //validate for user inputing characters under 6
        if (username.length < min || password.length < min){
            throw new Error("Username or password input needs to be greater than 5 and less than 17 characters. Please Try Again.");
        //validate for user inputing characters above 16
        } else if(username.length > max || password.length > max){
            throw new Error("Username or password input needs to be greater than 5 and less than 17 characters. Please Try Again.")
        //validate for user inputing a space into input text
        } else if(username.includes(" ") || password.includes(" ")){
            setError("");
            throw new Error("Username and password cannot accept spaces. Please Try Again.")
        }
    }

    return(
        <>
            <div className="container loginRegister">
                <div className="Login_Register">
                    <button><h2>Login</h2></button>
                    <h2>|</h2>
                    <span><button><h2><Link to='/register' className="linkColor">Register</Link></h2></button></span>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input required value={username} placeholder="Username" onChange={e =>{
                            setUsername(e.target.value)
                        }}/>
                    </label>
                    <label>
                        <input required value={password} placeholder="Password" onChange={e =>{
                            setPassword(e.target.value)
                        }}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <span>{error && <p>{error}</p>}</span>
        </>
    )
}