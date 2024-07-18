import { garaza } from "./garaza.js";

export class parking {

    constructor(role) {

        this.naziv = "Default";
        

        this.parkingSpaces = null;
        this.freeSpace = 0;
        this.groundLevel = 0;
        this.databaseData = "";
        this.updateCallback = 0;
        this.listSpots = [];
        this.listOfTakenSpots = [];
        this.role = role;
    }


    createParking(rows, columns, parkingLot, garaza) {

        var id = 1;
        this.parkingSpaces = document.createElement('div');
        this.parkingSpaces.className = 'parkingSpaces';
        this.parkingSpaces.setAttribute('id', garaza.parkingID);
        parkingLot.appendChild(this.parkingSpaces);
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.classList.add('row');

            //Proveravamo da l je red neparan
            if (i%2 != 0)
            {
                //Crtam put
                for (let j = 0; j < columns; j++) {
                    const roadHorizontal = document.createElement('div');
                    roadHorizontal.classList.add('roadHorizontal');
                    row.appendChild(roadHorizontal);

                    const roadHorizontalLine = document.createElement('div');
                    roadHorizontalLine.classList.add('roadHorizontalLine');
                    roadHorizontal.appendChild(roadHorizontalLine);
                }
            }
            else
            {
                //Prolazak kroz kolone
                for (let j = 0; j < columns; j++) {
                    
                    //Sluzi za crtanje vertikalnog puta levo
                    if (i != 0 && i != rows - 1 && j == 0)
                    {
                        const roadVertical = document.createElement('div');
                        roadVertical.classList.add('roadVertical');
                        row.appendChild(roadVertical);

                        const roadVerticalLine = document.createElement('div');
                        roadVerticalLine.classList.add('roadVerticalLine');
                        roadVertical.appendChild(roadVerticalLine);
                    }
                    //Crtanje druge vertikalne linije desno
                    else if (i == rows - 1 && j == columns - 2 && this.groundLevel)
                    {
                        const roadVertical = document.createElement('div');
                        roadVertical.classList.add('roadVertical');
                        row.appendChild(roadVertical); 
                        
                        const roadVerticalLine = document.createElement('div');
                        roadVerticalLine.classList.add('roadVerticalLine');
                        roadVertical.appendChild(roadVerticalLine);
                    }
                    //Za drugi i treci nivo crta vertikalni put desno
                    else if (i != 0 && i != rows - 1 && j == columns - 1 && !this.groundLevel)
                    {
                        const roadVertical = document.createElement('div');
                        roadVertical.classList.add('roadVertical');
                        row.appendChild(roadVertical); 

                        const roadVerticalLine = document.createElement('div');
                        roadVerticalLine.classList.add('roadVerticalLine');
                        roadVertical.appendChild(roadVerticalLine);
                    }
                    else {

                        const spot = document.createElement('button');
                        spot.classList.add('spot');

                        const spotNumber = document.createElement('div');
                        spotNumber.className = 'spotNumber';
                        spot.appendChild(spotNumber);
                        var textNode = document.createTextNode(id); 
                        spotNumber.appendChild(textNode);

                        spot.setAttribute('id', id);
                        id++;

                        spot.addEventListener('click', (event) => {
                            if (spot.classList.contains("parked-spot")){
                                this.openInfoBox(spot.id);
                            }
                            else
                            {

                                //Cisti sve markove obojeno u plavo oznaceno
                                this.listSpots.forEach(spot => {
                                    if (spot.classList.contains("marked-spot")) {
                                        spot.classList.remove('marked-spot');
                                        spot.classList.add("spot");
                                    }
                                });

                                garaza.selectedPlaceID = spot.id;
                                spot.classList.add("marked-spot");
                                spot.classList.remove("spot");
                            }
                        });
                        row.appendChild(spot);
                        this.listSpots.push(spot);
                    }
                }
            }
            this.parkingSpaces.appendChild(row);
        }
        garaza.parkingID++;
    }

    async updateSpots() {
        let takenSpots = 0;
        this.listOfTakenSpots = [];
    
    
            // PRVO BRISEMO SVA PARKIRANA VOZILA PA IH ONDA IZ BAZE
            // OPET UPARKIRAVO
            this.listSpots.forEach(spot => {
                if (spot.classList.contains("parked-spot")) {
                    spot.className = ('');
                    spot.classList.add('spot');
                    spot.childNodes[0].classList.remove('hidden');
                }
            });
    
            // data.forEach(result => {
            //     var placeID = result.placeID;
            //     const placeObject = document.getElementById(placeID);
            //     if (this.listSpots.includes(placeObject)) {
            //         takenSpots++;
            //         this.listOfTakenSpots.push(placeID);
            //     }
            //     placeObject.classList.remove('spot');
            //     placeObject.classList.add('parked-spot');
            //     placeObject.childNodes[0].classList.add("hidden");
    
            //     var colorTrimmed = result.color.trim();
            //     switch (colorTrimmed) {
            //         case 'Crna':
            //             placeObject.classList.add('parkedBlack');
            //             break;
            //         case 'Plava':
            //             placeObject.classList.add('parkedBlue');
            //             break;
            //         case 'Siva':
            //             placeObject.classList.add('parkedGray');
            //             break;
            //         case 'Zelena':
            //             placeObject.classList.add('parkedGreen');
            //             break;
            //         case 'Ostalo':
            //             placeObject.classList.add('parkedOstalo');
            //             break;
            //         case 'Roze':
            //             placeObject.classList.add('parkedPink');
            //             break;
            //         case 'Crvena':
            //             placeObject.classList.add('parkedRed');
            //             break;
            //         case 'Bela':
            //             placeObject.classList.add('parkedWhite');
            //             break;
            //         case 'Zuta':
            //             placeObject.classList.add('parkedYellow');
            //             break;
            //     }
            // });
    
            this.freeSpace = this.listSpots.length - takenSpots;
 
    }
    

    async openInfoBox(id){

        
        var carData;

        async function getAllVehicles() {
           
                // Fetch poziv za slanje podataka na server
                const response = await fetch('http://localhost:5000/openInfoBox', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                carData = data;
                console.log('Odgovor od servera:', data);
        }
        
        const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
        const ulogovaniKorisnikCookie = cookies.find(cookie => cookie[0].trim() === 'ulogovani_korisnik');

        if (ulogovaniKorisnikCookie) {
            var ulogovaniKorisnikVrednost = ulogovaniKorisnikCookie[1];
            console.log('Vrednost kolačića ulogovani_korisnik:', ulogovaniKorisnikVrednost);
        } else {
            console.log('Kolačić ulogovani_korisnik nije postavljen.');
        }



        await getAllVehicles();


        console.log('carData je ' +carData);
        console.log("Passed it " + id);

        this.infoBoxDiv = document.createElement('div');
        this.infoBoxDiv.className = 'infoBoxDiv';
        document.body.appendChild(this.infoBoxDiv);

        var carId;
        var brand;
        var model;
        var license;
        var color;
        var nivo;
        var time;
        var korisnik_id;


        carData.forEach(result => {
            //foreach prolazi kroz sva kola koja se nalaze u databaseData
            //u if se proverava da li je id koji smo mi kliknuli
            //poklapa sa elementom iz foreach petlje, ako jeste
            //to znaci da su to nasa kola i uzima njihove podatke
            if (id == result.mesto)
            {
                carId = result.id;
                brand = result.brand;
                model = result.model;
                license = result.license;
                color = result.color;
                nivo = result.nivo;
                time = result.time;
                korisnik_id = result.id_korisnik;
            }   
        });


        this.infoBox = document.createElement('div');
        this.infoBox.className = 'infoBox';
        this.infoBoxDiv.appendChild(this.infoBox);

        this.infoBoxButton = document.createElement('div');
        this.infoBoxButton.className = 'infoBoxButton';
        this.infoBox.appendChild(this.infoBoxButton);

        const button = document.createElement('button');
        button.className = "XButton";
        button.textContent = 'X';
        this.infoBoxButton.appendChild(button);

        button.addEventListener('click', () => {
            this.infoBoxDiv.remove();
        });

        this.infoBoxHeader = document.createElement('div');
        this.infoBoxHeader.className = 'infoBoxHeader';
        this.infoBox.appendChild(this.infoBoxHeader);
        var tekst = 'Vozilo ' + license.toString();
        var textNode = document.createTextNode(tekst); 
        this.infoBoxHeader.appendChild(textNode);

        this.infoBoxContent = document.createElement('div');
        this.infoBoxContent.className = 'infoBoxContent';
        this.infoBox.appendChild(this.infoBoxContent);

        this.infoBoxBrand = document.createElement('div');
        this.infoBoxBrand.className = 'infoBoxBrand';
        this.infoBoxContent.appendChild(this.infoBoxBrand);
        var tekst = "Marka: " + brand;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxBrand.appendChild(textNode);

        this.infoBoxModel = document.createElement('div');
        this.infoBoxModel.className = 'infoBoxModel';
        this.infoBoxContent.appendChild(this.infoBoxModel);
        var tekst = "Model: " + model;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxModel.appendChild(textNode);

        this.infoBoxLicense = document.createElement('div');
        this.infoBoxLicense.className = 'infoBoxLicense';
        this.infoBoxContent.appendChild(this.infoBoxLicense);
        var tekst = "Registarska oznaka: " + license;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxLicense.appendChild(textNode);

        this.infoBoxColor = document.createElement('div');
        this.infoBoxColor.className = 'infoBoxColor';
        this.infoBoxContent.appendChild(this.infoBoxColor);
        var tekst = "Boja: " + color;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxColor.appendChild(textNode);

        this.infoBoxNivo = document.createElement('div');
        this.infoBoxNivo.className = 'infoBoxNivo';
        this.infoBoxContent.appendChild(this.infoBoxNivo);
        var tekst = "Nivo: " + nivo;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxNivo.appendChild(textNode);

        this.infoBoxSpot = document.createElement('div');
        this.infoBoxSpot.className = 'infoBoxSpot';
        this.infoBoxContent.appendChild(this.infoBoxSpot);
        var tekst = "Parking mesto: " + id;
        var textNode = document.createTextNode(tekst); 
        this.infoBoxSpot.appendChild(textNode);

        this.infoBoxParkedTime = document.createElement('div');
        this.infoBoxParkedTime.className = 'infoBoxParkedTime';
        this.infoBoxContent.appendChild(this.infoBoxParkedTime);

        const parkedDate = new Date(time);
        console.log(parkedDate);

        // Provera da li je datum uspešno parsiran
        if (isNaN(parkedDate.getTime())) {
            console.error('Neispravan format datuma:', time);
        } else {
            // Izdvajanje delova datuma
            const day = parkedDate.getDate();
            const month = parkedDate.getMonth() + 1;
            const year = parkedDate.getFullYear().toString();
            const hour = parkedDate.getHours().toString().padStart(2, '0');
            const minute = parkedDate.getMinutes().toString().padStart(2, '0');
        
            const formatiranoVreme = `${day}/${month}/${year} - ${hour}:${minute}`;
        
            var tekst = "Vreme parkiranja: " + formatiranoVreme;
            var textNode = document.createTextNode(tekst); 
            this.infoBoxParkedTime.appendChild(textNode);
        }

        console.log("data id je " + korisnik_id + "a session je " +ulogovaniKorisnikVrednost)
        if (this.role == "Admin")
        {
            this.infoBoxButtons = document.createElement('div');
            this.infoBoxButtons.className = 'infoBoxButtons';
            this.infoBox.appendChild(this.infoBoxButtons);
    
            this.editButton = document.createElement('button');
            this.editButton.className = 'editButton';
            this.editButton.textContent = "Izmeni podatke";
            this.infoBoxButtons.appendChild(this.editButton);
    
            this.unparkButton = document.createElement('button');
            this.unparkButton.className = 'unparkButton';
            this.unparkButton.textContent = "Isparkiraj vozilo";
            this.infoBoxButtons.appendChild(this.unparkButton);
    
            this.editButton.addEventListener('click', (event) => {
                this.infoBoxDiv.remove();
                this.editVehicle(carId, brand, model, license, color, id, nivo);
    
            })
    
            this.unparkButton.addEventListener('click', (event) => {
                this.infoBoxDiv.remove();
                this.removeVehicle(carId, license, time);
    
            })
        }
        else if (this.role == "User" && korisnik_id == ulogovaniKorisnikVrednost)
        {
            this.infoBoxButtons = document.createElement('div');
            this.infoBoxButtons.className = 'infoBoxButtons';
            this.infoBox.appendChild(this.infoBoxButtons);
    
            this.editButton = document.createElement('button');
            this.editButton.className = 'editButton';
            this.editButton.textContent = "Izmeni podatke";
            this.infoBoxButtons.appendChild(this.editButton);
    
            this.unparkButton = document.createElement('button');
            this.unparkButton.className = 'unparkButton';
            this.unparkButton.textContent = "Isparkiraj vozilo";
            this.infoBoxButtons.appendChild(this.unparkButton);
    
            this.editButton.addEventListener('click', (event) => {
                this.infoBoxDiv.remove();
                this.editVehicle(carId, brand, model, license, color, id, nivo);
    
            })
    
            this.unparkButton.addEventListener('click', (event) => {
                this.infoBoxDiv.remove();
                this.removeVehicle(carId, license, time);
    
            })
        }



    }

    editVehicle(carId, brand, model, license, color, id, nivo){
        this.editBoxDiv = document.createElement('div');
        this.editBoxDiv.className = 'editBoxDiv';
        document.body.appendChild(this.editBoxDiv);

        this.editBox = document.createElement('div');
        this.editBox.className = 'editBox';
        this.editBoxDiv.appendChild(this.editBox);

        this.editBoxButton = document.createElement('div');
        this.editBoxButton.className = 'editBoxButton';
        this.editBox.appendChild(this.editBoxButton);
        
        const xButton = document.createElement('button');
        xButton.className = "XButton";
        xButton.textContent = 'X';
        this.editBoxButton.appendChild(xButton);

        xButton.addEventListener('click', () => {
            this.editBoxDiv.remove();
        });

        this.editVehicleHeader = document.createElement('div');
        this.editVehicleHeader.className = 'editVehicleHeader';
        this.editBox.appendChild(this.editVehicleHeader);
        var tekst = 'Izmena vozila ' + license;
        var textNode = document.createTextNode(tekst); 
        this.editVehicleHeader.appendChild(textNode);

        this.editBoxContent = document.createElement('div');
        this.editBoxContent.className = 'editBoxContent';
        this.editBox.appendChild(this.editBoxContent);

        this.editInputBrandDiv = document.createElement('div');
        this.editInputBrandDiv.className = 'editInputBrandDiv';
        this.editBoxContent.appendChild(this.editInputBrandDiv);

        this.editInputBrand = document.createElement('input');
        this.editInputBrand.className = "editInputBrand";
        this.editInputBrand.value = brand;
        this.editInputBrand.placeholder = "Marka";
        this.editInputBrandDiv.appendChild(this.editInputBrand);

        this.editInputModelDiv = document.createElement('div');
        this.editInputModelDiv.className = 'editInputModelDiv';
        this.editBoxContent.appendChild(this.editInputModelDiv);

        this.editInputModel = document.createElement('input');
        this.editInputModel.className = "editInputModel";
        this.editInputModel.value = model;
        this.editInputModel.placeholder = "Model";
        this.editInputModelDiv.appendChild(this.editInputModel);

        this.editInputLicenseDiv = document.createElement('div');
        this.editInputLicenseDiv.className = 'editInputLicenseDiv';
        this.editBoxContent.appendChild(this.editInputLicenseDiv);

        this.editInputLicense = document.createElement('input');
        this.editInputLicense.className = "editInputLicense";
        this.editInputLicense.value = license;
        this.editInputLicense.placeholder = "Registarska oznaka";
        this.editInputLicenseDiv.appendChild(this.editInputLicense);

        this.editInputColorDiv = document.createElement('div');
        this.editInputColorDiv.className = 'editInputColorDiv';
        this.editBoxContent.appendChild(this.editInputColorDiv);

        this.editInputColor = document.createElement('select');
        this.editInputColor.className = "editInputColor";
        this.editInputColor.value = color;
        this.editInputColor.textContent = color;
        this.colorDropdown(this.editInputColor, this.editInputColorDiv);

        switch (color.trim())
        {
            case 'Crna':
                this.editInputColor.selectedIndex = 0;
            break;

            case 'Plava':
                this.editInputColor.selectedIndex = 1;
            break;

            case 'Siva':
                this.editInputColor.selectedIndex = 2;
            break;

            case 'Zelena':
                this.editInputColor.selectedIndex = 3;
            break;

            case 'Roze':
                this.editInputColor.selectedIndex = 4;
            break;

            case 'Crvena':
                this.editInputColor.selectedIndex = 5;
            break;

            case 'Bela':
                this.editInputColor.selectedIndex = 6;
            break;

            case 'Zuta':
                this.editInputColor.selectedIndex = 7;
            break;

            case 'Ostalo':
                this.editInputColor.selectedIndex = 8;
            break;
        }

        this.editInputParkingIDDiv = document.createElement('div');
        this.editInputParkingIDDiv.className = 'editInputParkingIDDiv';
        this.editBoxContent.appendChild(this.editInputParkingIDDiv);

        this.editInputParkingID = document.createElement('input');
        this.editInputParkingID.className = "editInputParkingID";
        this.editInputParkingID.value = nivo;
        this.editInputParkingID.placeholder = "Nivo garaze";
        this.editInputParkingIDDiv.appendChild(this.editInputParkingID);
        
        this.editInputPlaceIDDiv = document.createElement('div');
        this.editInputPlaceIDDiv.className = 'editInputPlaceIDDiv';
        this.editBoxContent.appendChild(this.editInputPlaceIDDiv);

        this.editInputPlaceID = document.createElement('input');
        this.editInputPlaceID.className = "editInputPlaceID";
        this.editInputPlaceID.value = id;
        this.editInputPlaceID.placeholder = "Parkirano mesto";
        this.editInputPlaceIDDiv.appendChild(this.editInputPlaceID);

        this.editVehicleButtons = document.createElement('div');
        this.editVehicleButtons.className = 'editVehicleButtons';
        this.editBox.appendChild(this.editVehicleButtons);

        this.editConfirm = document.createElement('button');
        this.editConfirm.className = 'editConfirm';
        this.editConfirm.textContent = "Sacuvaj izmene";
        this.editVehicleButtons.appendChild(this.editConfirm);




        this.editConfirm.addEventListener('click', async () => {

            if (this.editInputPlaceID.value > 22)
            {
                alert("Mesto van opsega!")
            }
            else{
                const newFormData = {
                    Id: carId,
                    brand: this.editInputBrand.value,
                    model: this.editInputModel.value,
                    license: this.editInputLicense.value,
                    color: this.editInputColor.value,
                    parkingID: this.editInputParkingID.value,
                    placeID: this.editInputPlaceID.value
                };
    
                const newFormDataJSON = JSON.stringify(newFormData)
                console.log(newFormDataJSON);

                console.log("zauzeti " +this.listOfTakenSpots);
                
                if (id != this.editInputPlaceID.value && this.listOfTakenSpots.includes(parseInt(this.editInputPlaceID.value)))
                {
                    alert("Izabrano mesto za parking je zauzeto");
                }
                else
                {
                    fetch(`http://localhost:5000/updateVehicle`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newFormData),
                        credentials: 'include',
                    })
                    .then((response) => {
                        if (!response.ok){
                        if (response.status == 400) {
                        throw new Error(`Uneti podaci su neispravni!`);
                        }
                        else{
                            throw new Error(`Network response was not ok ${response.status}`);
                            }
                        }
                        return response;
                    })
                    .then(() => {               
                        this.editBoxDiv.remove();
                        window.location.reload();
                    })
                    .catch((error) => {
                        alert("Greska prilikom izmene vozila!");
                        console.error(error);
                    });
                }
            }
        });
            

    }

    colorDropdown(inputBoja, boja) {

        inputBoja.id = 'carDropdown';
        boja.appendChild(inputBoja);

        const blackOption = document.createElement('option');
        blackOption.value = 'Crna';
        blackOption.text = 'Crna';
        inputBoja.add(blackOption);

        const blueOption = document.createElement('option');
        blueOption.value = 'Plava';
        blueOption.text = 'Plava';
        inputBoja.add(blueOption);

        const grayOption = document.createElement('option');
        grayOption.value = 'Siva';
        grayOption.text = 'Siva';
        inputBoja.add(grayOption);

        const greenOption = document.createElement('option');
        greenOption.value = 'Zelena';
        greenOption.text = 'Zelena';
        inputBoja.add(greenOption);

        const pinkOption = document.createElement('option');
        pinkOption.value = 'Roze';
        pinkOption.text = 'Roze';
        inputBoja.add(pinkOption);

        const redOption = document.createElement('option');
        redOption.value = 'Crvena';
        redOption.text = 'Crvena';
        inputBoja.add(redOption);

        const whiteOption = document.createElement('option');
        whiteOption.value = 'Bela';
        whiteOption.text = 'Bela';
        inputBoja.add(whiteOption);

        const yellowOption = document.createElement('option');
        yellowOption.value = 'Zuta';
        yellowOption.text = 'Zuta';
        inputBoja.add(yellowOption);

        const ostaloOption = document.createElement('option');
        ostaloOption.value = 'Ostalo';
        ostaloOption.text = 'Ostalo';
        inputBoja.add(ostaloOption);
    }

    removeVehicle(carId, regOznaka, time){
        var base = this;
        const newFormData = {
            Id: carId
        };

        const newFormDataJSON = JSON.stringify(newFormData)
        console.log(newFormDataJSON);
    
        // Slanje podataka na API endpoint
        fetch(`http://localhost:5000/removeVehicle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFormData),
            credentials: 'include',
        })
        .then((response) => {
            if (!response.ok){
            if (response.status == 400) {
            throw new Error(`Greska!`);
            }
            else{
                throw new Error(`Network response was not ok ${response.status}`);
                }
            }
            return response;
        })
        .then(() => {
            console.log("Vozilo izbrisano!");
            
        })
        .catch((error) => {
            alert(error);
            console.error(error);
        });

        var nowDate =  new Date();

        this.unparkVehicleDiv = document.createElement('div');
        this.unparkVehicleDiv.className = 'unparkVehicleDiv';
        document.body.appendChild(this.unparkVehicleDiv);

        this.unparkVehicleBox = document.createElement('div');
        this.unparkVehicleBox.className = 'unparkVehicleBox';
        this.unparkVehicleDiv.appendChild(this.unparkVehicleBox);

        this.unparkVehicleButton = document.createElement('div');
        this.unparkVehicleButton.className = 'unparkVehicleButton';
        this.unparkVehicleBox.appendChild(this.unparkVehicleButton);

        const xButton = document.createElement('button');
        xButton.className = "XButton";
        xButton.textContent = 'X';
        this.unparkVehicleButton.appendChild(xButton);

        this.unparkVehicleHeader = document.createElement('div');
        this.unparkVehicleHeader.className = 'unparkVehicleHeader';
        this.unparkVehicleBox.appendChild(this.unparkVehicleHeader);
        var tekst = 'Vozilo ' + regOznaka + ' isparkirano';
        var textNode = document.createTextNode(tekst); 
        this.unparkVehicleHeader.appendChild(textNode);

        xButton.addEventListener('click', () => {
            this.unparkVehicleDiv.remove();
            window.location.reload();
        });

        this.unparkVehicleContent = document.createElement('div');
        this.unparkVehicleContent.className = 'unparkVehicleContent';
        this.unparkVehicleBox.appendChild(this.unparkVehicleContent);

        //Pretvaranje vremena parkiranja i trenutno vreme u JS citljivi format
        const formalOldTime = new Date(time);
        const formalNowTime = new Date();

        // Izračunavanje razlike u satima
        const timeDifferenceInSeconds = Math.abs(formalNowTime - formalOldTime);
        const timeDifferenceInHours = timeDifferenceInSeconds / (1000 * 60 * 60);

        var payTime = Math.ceil(timeDifferenceInHours);

        if (payTime > 3)
        {
            var totalTime = 'Vreme naplate parkinga: '+ (payTime - 3) + "h";
            var payment = 'Naplata: ' + (payTime - 3) * 80 + " rsd";
        }
        else
        {
            var totalTime = 'Vreme naplate parkinga: '+ 0 + "h";
            var payment = 'Naplata: ' + 0 + " rsd";
        }

        this.unparkVehiclePayTime = document.createElement('div');
        this.unparkVehiclePayTime.className = 'unparkVehiclePayTime';
        this.unparkVehicleContent.appendChild(this.unparkVehiclePayTime);
        var totalTimeNode = document.createTextNode(totalTime); 
        this.unparkVehiclePayTime.appendChild(totalTimeNode);

        this.unparkVehiclePrice = document.createElement('div');
        this.unparkVehiclePrice.className = 'unparkVehiclePrice';
        this.unparkVehicleContent.appendChild(this.unparkVehiclePrice);
        var paymentNode = document.createTextNode(payment); 
        this.unparkVehiclePrice.appendChild(paymentNode);

        this.unparkVehicleStatus = document.createElement('div');
        this.unparkVehicleStatus.className = 'unparkVehicleStatus';
        this.unparkVehicleContent.appendChild(this.unparkVehicleStatus);

        if (payTime <= 3)
        {
            var tekst = 'Parking za vozilo je besplatan.';
        }
        else
        {
            var tekst = 'Potrebna naplata za vozilo.'
        }

        var textNode = document.createTextNode(tekst); 
        this.unparkVehicleStatus.appendChild(textNode);

        this.unparkVehicleOk = document.createElement('div');
        this.unparkVehicleOk.className = 'unparkVehicleOk';
        this.unparkVehicleBox.appendChild(this.unparkVehicleOk);

        const okButton = document.createElement('button');
        okButton.className = "okButton";
        okButton.textContent = 'U redu';
        this.unparkVehicleOk.appendChild(okButton);

        okButton.addEventListener('click', () => {
            this.unparkVehicleDiv.remove();
            window.location.reload();
        });
    }
}
