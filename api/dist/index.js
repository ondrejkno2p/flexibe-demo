"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.listen(3001);
app.use((req, res, next) => {
    console.log(req.url);
    next();
});
app.get('/api', (request, response) => {
    const start = request.query.start ? request.query.start : "0";
    const limit = request.query.start ? request.query.limit : "20";
    const q = request.query.q ? request.query.q : "";
    // console.log(request.query)
    fetch('https://demo.flexibee.eu/c/demo/objednavka-prijata.json?detail=full&start=' + start + '&limit=' + limit + '&q=' + q + '&add-row-count=true').then((res) => {
        return res.json();
    }).then((body) => {
        const faktury = body.winstrom['objednavka-prijata'].map((fakturaFull) => {
            const faktura = {
                id: fakturaFull.id,
                uzivatel: fakturaFull['uzivatel@showAs'],
                kod: fakturaFull.kod,
                kontaktJmeno: fakturaFull.kontaktJmeno,
                mesto: fakturaFull.mesto,
                psc: fakturaFull.psc,
                dic: fakturaFull.dic,
                ic: fakturaFull.ic,
                ulice: fakturaFull.ulice,
                stat: fakturaFull['stat@showAs'],
                formaDopravy: fakturaFull['formaDopravy@showAs'],
                sumCelkem: fakturaFull.sumCelkem,
                mena: fakturaFull.mena,
                stavUzivK: fakturaFull['stavUzivK@showAs'],
                bezPolozek: fakturaFull.bezPolozek,
                polozky: fakturaFull.polozkyObchDokladu ? fakturaFull.polozkyObchDokladu.map((polozka) => { return { nazev: polozka.nazev, kod: polozka.kod }; }) : undefined,
            };
            return faktura;
        });
        response.setHeader("cache-control", 'max-age=3600');
        response.json({ faktury: faktury, rowCount: body.winstrom['@rowCount'] });
    }).catch((error) => {
        console.log(error);
    });
});
app.get('/api/:id', (request, response) => {
    fetch('https://demo.flexibee.eu/c/demo/objednavka-prijata/' + request.params.id + '.json').then((res) => {
        return res.json();
    }).then((body) => {
        // console.log(body)
        const faktura = body.winstrom['objednavka-prijata'].map((fakturaFull) => {
            const faktura = {
                id: fakturaFull.id,
                uzivatel: fakturaFull['uzivatel@showAs'],
                kod: fakturaFull.kod,
                kontaktJmeno: fakturaFull.kontaktJmeno,
                mesto: fakturaFull.mesto,
                psc: fakturaFull.psc,
                dic: fakturaFull.dic,
                ic: fakturaFull.ic,
                ulice: fakturaFull.ulice,
                stat: fakturaFull['stat@showAs'],
                formaDopravy: fakturaFull['formaDopravy@showAs'],
                sumCelkem: fakturaFull.sumCelkem,
                mena: fakturaFull.mena,
                stavUzivK: fakturaFull['stavUzivK@showAs'],
                bezPolozek: fakturaFull.bezPolozek,
                polozky: fakturaFull.polozkyObchDokladu ? fakturaFull.polozkyObchDokladu.map((polozka) => { return { nazev: polozka.nazev, kod: polozka.kod }; }) : undefined,
            };
            return faktura;
        });
        response.setHeader("cache-control", 'max-age=3600');
        response.json(faktura[0]);
    }).catch((error) => {
        console.log(error);
    });
});
exports.default = app;
