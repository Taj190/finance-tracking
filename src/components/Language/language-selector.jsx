import React from 'react'
import './style.css'
import { useTranslation } from 'react-i18next'
const languges =[
    {code:'en', lang:'English'},
    {code:'fr', lang:'French'},
    {code:'pb', lang:'Punjabi'},
]

const Language_selector=()=> {
    const{i18n}= useTranslation()
    function selectLang(lng){
        i18n.changeLanguage(lng)
        localStorage.setItem('i18nextLng', lng)
    }
  return (
    <div>{
         languges.map((lng)=>(
        <button className={lng.code===i18n.language ? 'selector' : ""} key={lng.code} onClick={ ()=>   selectLang(lng.code)} >{lng.lang}</button>
     ))   }</div>
  )
}

export default Language_selector