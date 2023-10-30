"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.getFilterByPolozkyObchDokladu = exports.getObjednavkaPrijata = void 0;
const getObjednavkaPrijata = (objednavkaPrijataData) => {
    const faAdresa = !(objednavkaPrijataData.faUlice === "" &&
        objednavkaPrijataData.faMesto === "" &&
        objednavkaPrijataData.faPsc === "" &&
        objednavkaPrijataData.faStat === "");
    const objednavkaPrijata = {
        id: objednavkaPrijataData.id,
        uzivatel: objednavkaPrijataData["uzivatel@showAs"],
        kod: objednavkaPrijataData.kod,
        kontaktJmeno: objednavkaPrijataData.kontaktJmeno,
        dic: objednavkaPrijataData.dic,
        ic: objednavkaPrijataData.ic,
        mesto: faAdresa
            ? objednavkaPrijataData.faMesto
            : objednavkaPrijataData.mesto,
        psc: faAdresa ? objednavkaPrijataData.faPsc : objednavkaPrijataData.psc,
        ulice: faAdresa
            ? objednavkaPrijataData.faUlice
            : objednavkaPrijataData.ulice,
        stat: faAdresa
            ? objednavkaPrijataData["faStat@showAs"]
            : objednavkaPrijataData["stat@showAs"],
        formaDopravy: objednavkaPrijataData["formaDopravy@showAs"],
        sumCelkem: objednavkaPrijataData.sumCelkem,
        mena: objednavkaPrijataData.mena,
        stavUzivK: objednavkaPrijataData["stavUzivK@showAs"],
        bezPolozek: objednavkaPrijataData.bezPolozek,
        polozky: objednavkaPrijataData.polozkyObchDokladu
            ? objednavkaPrijataData.polozkyObchDokladu.map((polozka) => {
                return { id: polozka.id, nazev: polozka.nazev, kod: polozka.kod };
            })
            : undefined,
        formaUhrady: objednavkaPrijataData["formaUhradyCis@showAs"],
        fakturaVydana: getFakturaId(objednavkaPrijataData.vazby),
    };
    return objednavkaPrijata;
};
exports.getObjednavkaPrijata = getObjednavkaPrijata;
const getFakturaId = (vazby) => {
    if (vazby.length == 0) {
        return null;
    }
    for (let i = 0; i < vazby.length; i++) {
        const vazba = vazby[i];
        if (vazba["b@ref"].search("/faktura-vydana/") > -1) {
            return vazba["b@ref"].split("/").slice(-1)[0].replace(".json", "");
        }
    }
    return null;
};
const getFilterByPolozkyObchDokladu = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = new URLSearchParams([
            ["detail", "custom:doklObch(id)"],
            ["includes", "objednavka-prijata-polozka/doklObch"],
            ["limit", "0"],
        ]);
        const url = "https://demo.flexibee.eu/c/demo/objednavka-prijata-polozka/" +
            query +
            ".json?" +
            params.toString();
        const res = yield fetch(url);
        const body = yield res.json();
        const ids = body.winstrom["objednavka-prijata-polozka"].map((v) => {
            return v.doklObch[0].id;
        });
        return "(id in (" + ids.toString() + "))";
    }
    catch (error) {
        return undefined;
    }
});
exports.getFilterByPolozkyObchDokladu = getFilterByPolozkyObchDokladu;
exports.detail = [
    "uzivatel",
    "id",
    "kod",
    "kontaktJmeno",
    "dic",
    "ic",
    "mesto",
    "faMesto",
    "psc",
    "faPsc",
    "ulice",
    "faUlice",
    "stat",
    "faStat",
    "formaDopravy",
    "sumCelkem",
    "mena",
    "stavUzivK",
    "bezPolozek",
    "formaUhradyCis",
    "polozkyObchDokladu(nazev,id,kod)",
    "vazby",
];
