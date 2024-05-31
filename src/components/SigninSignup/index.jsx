import React, { useState } from 'react'
import './style.css'
import Input from '../Input'
import Button from '../Button'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, doc, provider, setDoc } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
function SignUp() {
 const [name, setName]=useState('')
 const [email, setEmail]=useState('')
 const [password, setPassword]=useState('')
 const [confirmPassword, setConfirmPassword]=useState('')
 const [loader, setLoader]=useState(false)
 const [loginForm, setLoginForm]=useState(false)
 const navigate = useNavigate()
 const { t } = useTranslation();
 function refreshUser() {
  setName('')
  setEmail('')
  setPassword('')
  setConfirmPassword('')
  setLoader(false)
 }
 
 function SignUpwithEmail(){
  
  if (name !== '' && email !== '' && password !== '' && password === confirmPassword){
    setLoader(true)
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log('user', user)
   toast.success('user created successfully')
   refreshUser()
   createdDoc(user)
   setLoader(false)
   navigate('/dashboard')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage)
      setLoader(false)
      // ..
     
    });

  }
  else if ( password !== confirmPassword){
    toast.error('password must match password')
  } 
  
  else{
    toast.error('all field are required')
  }

 }

 function loginUsingEmailAndPassword(){
  if (email!== '' && password!== ''){
    setLoader(true)
    signInWithEmailAndPassword( auth,email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('user', user)
      toast.success('user logged in successfully')
      navigate('/dashboard')
      setLoader(false)
      refreshUser()
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error', errorCode, errorMessage)
      toast.error('user doesnot exist')
      setLoader(false)
      refreshUser()
    });
   }else{
    toast.error('all field are required')
   }
 
 }

 async function createdDoc(user){
  if(!user) return ;
  const userRef = doc(db,"user",user.uid)
  const userData = await getDoc(userRef)
  if(!userData.exists()){
    try{
      await setDoc(doc(db, "users", user.uid),{
        name:  user.displayName ? user.displayName : name,
        email : user.email ,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt : new Date(),
      });
     }
     catch(e){
      toast.error(e.message)
   }
  }else {
    toast.error('user already exist')
  }
 }

 const GoogleAuth = async () => {
  setLoader(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await createdDoc(user);
    toast.success("User Authenticated Successfully!");
    setLoader(false);
    navigate("/dashboard");
    console.log(user)
  } catch (error) {
    setLoader(false);
    toast.error(error.message);
    console.error("Error signing in with Google: ", error.message);
  }
};
  return (
    <>
    {loginForm ? (
      <div className='sign-up-wrapper'>
      <h2 className='title'>Sign up on <span style={{color:"var(--theme)"}}>WalletWise</span></h2>

      <Input label={t('email')} 
      type='email'
      state={email}
       setState={setEmail}
        placeholder={'taj@gmail.com'}/>

<Input label={t('password')} 
      type='password'  
      state={password}
       setState={setPassword}
        placeholder={'Enter Password'}/>
     
     <Button disabled={loader} text= {loader ? 'loading' : " LogIn"} onClick={loginUsingEmailAndPassword}/>
     <p style={{textAlign:'center', margin:0}}>OR</p> 
     <Button onClick={GoogleAuth} text=" Login  with Google" blue={true}/> 
     <p className='loginpage' onClick={() => setLoginForm(!loginForm)}>Create an Account <span className='login' style={{color:'blueviolet'}} >Click here</span></p>

    </div>
    ) : 
    
    (
      <div className='sign-up-wrapper'>
      <h2 className='title'>Sign up on <span style={{color:"var(--theme)"}}>WalletWise</span></h2>
      <Input label={t('fullName')} 
      state={name}
       setState={setName}
        placeholder={'User Name'}
        />

<Input label={t('email')}
      type='email'
      state={email}
       setState={setEmail}
        placeholder={'taj@gmail.com'}/>

<Input label={t('password')}
      type='password'  
      state={password}
       setState={setPassword}
        placeholder={'Enter Password'}/>

<Input label={t('confirmPassword')}   
      type='password' 
      state={confirmPassword}
       setState={setConfirmPassword}
        placeholder={'Confrim Password'}/>

   <Button disabled={loader} text= {loader ? 'loading' : " Sign Up with Email and Password"} onClick={SignUpwithEmail}/>
   <p style={{textAlign:'center', margin:0}}>OR</p> 
   <Button onClick={GoogleAuth} text=" Sign Up with Google" blue={true}/> 
   <p className='loginpage'  onClick={() => setLoginForm(!loginForm)}>Have already Account <span className='login' style={{color:'blueviolet'}} >Click here</span></p>
    </div>
    
    )
    }
      </>
  )
}

export default SignUp