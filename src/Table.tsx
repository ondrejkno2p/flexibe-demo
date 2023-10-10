import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForwardStep, faForwardFast, faMagnifyingGlass, faBackwardStep, faBackwardFast } from '@fortawesome/free-solid-svg-icons'
import type { Faktura } from './types';
import Row from './Row';
function Table() {
  const defPageLen = 8;
  const defPage = 0;
  const defSearch = '';
  const [getFaktury,setFaktury] = useState<Faktura[]>([]);
  const [getPage,setPage] = useState(defPage);
  const [, setNavigating] = useState(true);
  const [isClient, setClient] = useState(false);
  const [search, setSearch] = useState(defSearch);
  const [getPageLen, setPageLen ] = useState(defPageLen);
  const [input, setInput] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const updatePage = ({limit,start,q}:{limit?:number, start?:number,  q?:string},callback?:()=>void)=>{
    const params = new URLSearchParams()
    if(limit!==undefined){
        params.append("limit",String(limit))
    }
    else{
        params.append("limit",String(getPageLen))
    }
    if(start!==undefined){
        params.append("start",String(start))
    }
    else{
        params.append("start",String(getPage))
    }
    if(q!==undefined && q.length>0) {
        params.append("q",q)
    }
    else if (q===undefined && search.length>0) {
        params.append("q",search)
    }
    console.log(params.toString())
    const url = '/api?'+params.toString()
    fetch(url).then((res)=>{return res.json()}).then((body)=>{
        setFaktury(body.faktury)
        setRowCount(body.rowCount)
        if(limit!==undefined) setPageLen(limit)
        if(start!==undefined) setPage(start)
        if(q!==undefined) setSearch(q)
        if(callback) callback()
      })
  }
  useEffect(()=>{
    if(!isClient){
      setClient(true);
      setNavigating(false);
    }
  },[isClient])
  useEffect(()=>{
    if(isClient){
      updatePage({start:0})
    }
  },[isClient])
  
  return (
    <div className="w-full h-full min-w-fit">
      <div className='flex justify-between py-4'> 
        <div className='flex flex-row group justify-around w-fit'>
          <input
          className='w-60 border-gray-600 bg-gray-100 hover:bg-gray-50 group-hover:bg-gray-50 focus:outline-none hover:border-gray-600 focus:border-black border-solid border-2 rounded-xl p-1 px-2 rounded-r-none'
          value={input}
          onKeyUp={(event)=>{
            if (event.key === 'Enter') {
              updatePage({start:0,q:input},()=>{
                setInput('')
              })
            }
          }
          }
          onChange={(event)=>{
            setInput(event.target.value);
          }}/>

          <button
          className='btn-primary w-10 h-10 rounded-l-none'
          disabled={false}
          onClick={()=>{
            if(input.length>0){
                updatePage({start:0,q:input},()=>{
                    setInput('')
                })
            }
          }}>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </button>
          {search.length>0 &&
            <div
            className='px-2'
            >
              <button
              className='btn-primary h-full px-2 hover:px-[6px] min-w-[6rem] text-center'
              onClick={()=>{
                updatePage({start:0,q:''})
              }}>
                {search}
              </button>
            </div>
          } 
        </div>
        <div className='flex items-center'>
        <button 
          className='btn-primary rounded-r-none w-10 h-10'
          disabled={getPage===0}
          onClick={()=>{
            updatePage({start:0})
          }}>
            <FontAwesomeIcon icon={faBackwardFast}/>
          </button>
          <button 
          className='btn-primary rounded-none w-10 h-10'
          disabled={getPage===0}
          onClick={()=>{
            updatePage({start:Math.max(0,getPage-getPageLen)})
          }}>
            <FontAwesomeIcon icon={faBackwardStep}/>
          </button>
          <button
          className='btn-primary rounded-none w-10 h-10'
          disabled={rowCount<=getPage+getPageLen}
          onClick={()=>{
            updatePage({start:getPage+getPageLen})
          }}>
            <FontAwesomeIcon icon={faForwardStep}/>
          </button>
          <button
          className='btn-primary rounded-l-none w-10 h-10'
          disabled={rowCount<=getPage+getPageLen}
          onClick={()=>{
            const endPage = rowCount>0?Math.floor(rowCount/getPageLen)*getPageLen:0
            updatePage({start:endPage==rowCount?Math.max(0,endPage-getPageLen):endPage})
          }}>
            <FontAwesomeIcon icon={faForwardFast}/>
          </button>
          <div className='flex'>
            <div className='grid grid-cols-[3rem,1rem,3rem,4rem] font-semibold'>
              <div className='text-center'>
                {getPage}
              </div>
              <div className='text-center'>
                -
              </div>
              <div className='text-center'>
                {Math.min(getPage+getPageLen,rowCount)}
              </div>
              <div className='text-center'>
                ({rowCount})
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='border-solid border-2 border-gray-300 rounded-md p-0 rounded-b-none'>
      <table className='table-fixed w-full'>
        <thead>
          <tr key={"0"} className='text-xl'>
            <th className='text-left px-2 py-4 w-[9rem]'>
              Uživatel
            </th>
            <th className='text-left px-2 py-4 w-[12rem]'>
              Adresa
            </th>
            <th className='text-left px-2 py-4 w-[9rem]'>
              Částka
            </th>
            <th className='text-left px-2 py-4 w-[11rem]'>
              Kód
            </th>
            <th className='text-left px-2 py-4 w-[9rem]'>
              Jméno
            </th>
            <th className='text-left px-2 py-4 w-[8rem]'>
              IČ/DIČ
            </th>
            <th className='text-left px-2 py-4 w-[9rem]'>
              Doprava
            </th>
            <th className='text-left px-2 py-4 w-[9rem]'>
              Forma Úhrady
            </th>
            <th className='text-left px-2 py-4 w-[12rem]'>
              Položky
            </th>
            <th className='text-left px-2 py-4 w-[8rem]'>
              Stav
            </th>
            <th className='text-center px-2 py-4 w-[4rem]'>
              PDF
            </th>
          </tr>
        </thead>
        <tbody className=''>
        {getFaktury.map((faktura,index)=>{
          return (
            <Row key={index} DefFaktura={faktura}/>
          )
        })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Table;
