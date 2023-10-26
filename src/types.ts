export type Faktura = {
  id: string;
  uzivatel: string;
  kod: string;
  kontaktJmeno: string;
  mesto: string;
  psc: string;
  dic: string;
  ic: string;
  ulice: string;
  stat: string;
  formaDopravy: string;
  bezPolozek: string;
  sumCelkem: string;
  mena: string;
  stavUzivK: string;
  polozky?: { kod: string; nazev: string; id: string }[];
  formaUhrady: string;
};
