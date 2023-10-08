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
          return <div> Bez Položek </div>
        }
        else{
          return <div className='relative w-full'>
            <button className='bg-blue-500' onClick={()=>{
                if(!faktura.polozky){
                    fetch('/api/'+id).then((res)=>{
                        return res.json()
                    }).then((body:any)=>{
                        setDetail(true);
                        setFaktura(body);
                    })
                }
                else{
                    setDetail(true);
                }

            }}>
              Položky {bezPolozek}
            </button>
            {detail && <div
                className='absolute z-10 bg-white w-full rounded-b-md overflow-scroll max-h-40'
                ref={newRef}
                >
                <ol>
                    {faktura?.polozky?.map((polozka,index)=>{
                        return <li className='w-full p-1 border-2 border-solid border-gray-100'
                        key={index}>{polozka.nazev}</li>
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
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      <div className='grid-rows-2'>
        <div className='relative text-ellipsis overflow-hidden whitespace-nowrap '>
          {faktura.ulice}
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
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.sumCelkem} {faktura.mena.split(':')[1]} 
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.kod}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.kontaktJmeno}  
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.dic}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.ic}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.formaDopravy}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {polozky(faktura.bezPolozek, faktura.id)}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300'>
      {faktura.stavUzivK}
    </td>
    <td className='p-1 border-l-2 border-r-2 border-solid border-gray-300 text-center'>
      <a href={'https://demo.flexibee.eu/c/demo/objednavka-prijata/'+faktura.id+'.pdf'}>
        <FontAwesomeIcon size='2x' icon={faFilePdf}/>
      </a>
    </td>
  </tr>)
}

export default Row