import type { Faktura } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react';

function Row({DefFaktura, index}:{DefFaktura:Faktura, index:number}){
    const newRef = useRef<any>(null);
    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      },[]);
    const handleOutsideClick = (event:any) => {
        if (newRef.current && !newRef.current.contains(event.target)) {
          setDetail(false)
        }
      };
    const [faktura,setFaktura] = useState(DefFaktura);
    const [detail, setDetail] = useState(false);
    useEffect(()=>{
        setFaktura(DefFaktura)
    },[DefFaktura])
    const polozky = (bezPolozek:string,id:string)=>{
        if(bezPolozek==="true"){
          return <div> Bez Položek {bezPolozek} </div> 
        }
        else{
          return <div className='relative w-full h-full block'>
            <button disabled={detail} className='active:bg-blue-200 bg-blue-400 rounded-xl p-1 border-solid border-2 border-black hover:bg-blue-300 disabled:bg-blue-50 w-full h-full disabled:rounded-b-none' onClick={()=>{
                if(!faktura.polozky){
                    fetch('/api/'+id).then((res)=>{
                        return res.json()
                    }).then((body:any)=>{
                        setDetail(true);
                        setFaktura(body);
                    })
                }
                else{
                    setDetail(detail?false:true);
                }
            }}>
              Zobrazit Položky
            </button>
            {detail && faktura?.polozky?.length && faktura?.polozky?.length>0 && <div
                className='border-solid border-2 border-black border-t-0 absolute z-10 bg-white w-full rounded-b-md overflow-scroll max-h-40'
                ref={newRef}
                >
                <ol>
                    {faktura?.polozky?.map((polozka,index)=>{
                        return <li className='w-full p-1 border-2 border-solid border-gray-100'
                        key={index}>{polozka.kod}:<br/>{polozka.nazev}</li>
                    })}
                </ol>
                </div>
            }
          </div>
        }
      }
    return(
    <tr key={index} className='border-2 border-solid border-gray-300 odd:bg-blue-100 even:bg-blue-50 hover:bg-blue-200'>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.uzivatel}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300 tool-tip'>
      <div className='grid-rows-3 text-ellipsis whitespace-nowrap overflow-hidden' >
        <div className='text-ellipsis whitespace-nowrap overflow-hidden'>
          {faktura.ulice}<br/>
        </div>
        <div className='text-ellipsis whitespace-nowrap overflow-hidden'>
          {faktura.mesto}{faktura.psc?', ':''}
          {faktura.psc}
          <br/>
        </div>
        <div className='text-ellipsis whitespace-nowrap overflow-hidden'>
          {faktura.stat}<br/>
        </div>
      </div>
      {(faktura.ulice || faktura.mesto || faktura.psc || faktura.stat) && (
      <span>
          <div className='grid-rows-3 whitespace-nowrap' >
          <div className=''>
            {faktura.ulice}<br/>
          </div>
          <div>
            {faktura.mesto}{faktura.psc?', ':''}
            {faktura.psc}
            <br/>
          </div>
          <div>
            {faktura.stat}<br/>
          </div>
        </div>
      </span>)
      }
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {/* <div className='grid-rows-2'> */}
        <div>
          {faktura.sumCelkem} {faktura.mena.split(':')[1]}<br/>
        </div>
      {/* </div> */}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.kod}
    </td>
    <td className='align-text-top p-1 border-l-2 border-r-2 border-solid border-gray-300 text-ellipsis overflow-hidden tool-tip'>
      {faktura.kontaktJmeno}
      {faktura.kontaktJmeno && <span>
          {faktura.kontaktJmeno}  
        </span>
      }
    </td>
    <td className=' border-l-2 border-r-2 border-solid border-gray-300'>
      <div className='grid-row-2 h-full'>
        <div className='border-solid border-b-2 border-gray-400'>
          {faktura.ic!=="null"?faktura.ic:''}<br/>
        </div>
        <div>
          {faktura.dic!=="null"?faktura.dic:''}<br/>
        </div>
      </div>
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.formaDopravy?faktura.formaDopravy.split(':')[1]:''}
    </td>
    <td>
      {faktura.formaUhrady?faktura.formaUhrady.split(':')[1]:''}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300 relative'>
      {polozky(faktura.bezPolozek, faktura.id)}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.stavUzivK}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300 text-center'>
      <a href={'/api/pdf/'+faktura.id+'.pdf'}>
        <FontAwesomeIcon size='2x' icon={faFilePdf}/>
      </a>
    </td>
  </tr>)
}

export default Row