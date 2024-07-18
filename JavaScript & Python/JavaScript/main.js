import { garaza } from "./garaza.js";
import { parking } from "./parking.js";


const garaza1 = new garaza("Javna Garaza");

garaza1.addParking(new parking("P1", true, updateGarageStatus));
garaza1.addParking(new parking("P2", false, updateGarageStatus));
garaza1.addParking(new parking("P3", false, updateGarageStatus));

garaza1.checkCookieAfterDelay('ulogovani_korisnik', 500);;

//garaza1.createBase(document.body);


function updateGarageStatus() {
    garaza1.updateParkingInfo();
}