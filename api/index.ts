import express from 'express'
import type {Faktura} from '../src/types'

const app = express();
app.listen(3001)

app.use((req, res, next) => {
  console.log(req.url)
  console.log(req.params)
  next()
})

const getFaktura = (fakturaFull:any)=>{
  const faAdresa = !(fakturaFull.faUlice==="" && fakturaFull.faMesto==="" && fakturaFull.faPsc==="" && fakturaFull.faStat==="");
  const faktura:Faktura={
    id:fakturaFull.id,
    uzivatel:fakturaFull['uzivatel@showAs'],
    kod:fakturaFull.kod,
    kontaktJmeno:fakturaFull.kontaktJmeno,
    mesto:faAdresa?fakturaFull.faMesto:fakturaFull.mesto,
    psc:faAdresa?fakturaFull.faPsc:fakturaFull.psc,
    dic:fakturaFull.dic,
    ic: fakturaFull.ic,
    ulice:faAdresa?fakturaFull.faUlice:fakturaFull.ulice,
    stat:faAdresa?fakturaFull['faStat@showAs']:fakturaFull['stat@showAs'],
    formaDopravy:fakturaFull['formaDopravy@showAs'],
    sumCelkem:fakturaFull.sumCelkem,
    mena:fakturaFull.mena,
    stavUzivK:fakturaFull['stavUzivK@showAs'],
    bezPolozek:fakturaFull.bezPolozek,
    polozky:fakturaFull.polozkyObchDokladu?fakturaFull.polozkyObchDokladu.map((polozka:any)=>{return {nazev:polozka.nazev,kod:polozka.kod}}):undefined,
    formaUhrady:fakturaFull['formaUhradyCis@showAs']
  }
  return faktura
}

app.get('/api',(request, response)=>{
    const start = request.query.start?request.query.start:"0"
    const limit = request.query.start?request.query.limit:"20"
    const q = request.query.q?request.query.q:""
    // console.log(request.query)
    fetch('https://demo.flexibee.eu/c/demo/objednavka-prijata.json?detail=full&start='+start+'&limit='+limit+'&q='+q+'&add-row-count=true').then((res)=>{
        return res.json()
      }).then((body)=>{
        const faktury=body.winstrom['objednavka-prijata'].map((fakturaFull:any)=>{
            return getFaktura(fakturaFull)
        })
        response.setHeader("cache-control",'max-age=3600')
        response.json({faktury:faktury,rowCount:body.winstrom['@rowCount']});
      }).catch((error)=>{
        console.log(error)
      })
})

app.get('/api/:id',(request, response)=>{
  fetch('https://demo.flexibee.eu/c/demo/objednavka-prijata/'+request.params.id+'.json').then((res)=>{
      return res.json()
    }).then((body)=>{
      const faktura=body.winstrom['objednavka-prijata'].map((fakturaFull:any)=>{
        return getFaktura(fakturaFull)
      })
      response.setHeader("cache-control",'max-age=3600')
      response.json(faktura[0]);
    }).catch((error)=>{
      console.log(error)
    })
})

app.get('/api/pdf/:id.pdf',(request, response)=>{
  fetch('https://demo.flexibee.eu/c/demo/objednavka-prijata/'+request.params.id+'.pdf').then((res)=>{
      return res.blob()
    }).then((body)=>{
      body.arrayBuffer().then((buffer)=>{
        response.send(new Buffer(buffer));
      })
    }).catch((error)=>{
      console.log(error)
    })
})

export default app
