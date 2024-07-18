export class garaza {
    constructor(naziv) {
        if (naziv) {
            this.naziv = naziv;
        } else {
            this.naziv = "Default";
        }
        this.spots = 0;
        this.spotID = 1;
        this.listParking = [];
        this.selectedPlaceID = null;
        this.currentLevel = null;
    }

    addParking(parking) {
        this.listParking.push(parking);
    }


    drawParking(){
        this.floorController = document.createElement('div');
        this.floorController.className = 'floorController';
        this.parkingLot.appendChild(this.floorController);

        //Broj nivoa
        var i = 1;

        this.listParking.forEach((parking) => {
            parking.createParking(5,8, this.parkingLot, this);
            const floorButton = document.createElement('button');
            floorButton.className = "floorButton";
            floorButton.textContent = i.toString();
            this.floorController.appendChild(floorButton);
            i++;

            floorButton.addEventListener('click', () => {
                this.showFloor(floorButton.textContent);
            });
        })

        this.showFloor(1);
        this.createParkingInfo();
    }

    showFloor(value){
        this.updateParkingInfo();
        this.currentLevel = value;

        //Trenutni nivo po default
        var i = 0;

        this.listParking.forEach((parking) => {
            /* Proveravamo da li je trenutni nivo jednak onome sto smo mi pozvali
                npr hocemo  da pokazemo nivo 2, proverava da li je trenutni nivo
                jednak 2-1 jer u listi indeksi krecu 0, pa se nivo 2 nalazi na 
                indeksu 1*/
            if (i == value - 1)
            {
                //Nasli smo parking koji hocemo da prikazemo
                parking.parkingSpaces.classList.remove("hidden");
            }
            else
            {
                parking.parkingSpaces.classList.add("hidden");
            }
            i++;
        })
    }

    createBase(gde){
        this.page = document.createElement('div');
        this.page.className = 'page';
        gde.appendChild(this.page)

        this.main = document.createElement('div');
        this.main.className = 'main';
        this.page.appendChild(this.main)

        this.mainHeader = document.createElement('div');
        this.mainHeader.className = 'mainHeader';
        this.main.appendChild(this.mainHeader)

        this.mainContent = document.createElement('div');
        this.mainContent.className = 'mainContent';
        this.main.appendChild(this.mainContent)

        this.header = document.createElement('div');
        this.header.className = 'header';
        this.mainHeader.appendChild(this.header)

        this.headerText = document.createElement('div');
        this.headerText.className = 'headerText';
        this.headerText.textContent = this.naziv;
        this.header.appendChild(this.headerText)

        this.content = document.createElement('div');
        this.content.className = 'content';
        this.mainContent.appendChild(this.content);

        this.parkingLot = document.createElement('div');
        this.parkingLot.className = 'parking-lot';
        this.mainContent.appendChild(this.parkingLot);

        this.addVehicle();
    }

    addVehicle() {
        this.formHeader = document.createElement('div');
        this.formHeader.className = 'formHeader';
        this.formHeader.textContent = "Podaci o vozilu";
        this.content.appendChild(this.formHeader)
    
        this.brand = document.createElement('div');
        this.brand.className = 'brand';
    
        const inputBrand = document.createElement('input');
        inputBrand.setAttribute('type', 'text');
        inputBrand.setAttribute('id', 'marka');
        inputBrand.setAttribute('placeholder', 'Unesite marku vozila');
        inputBrand.classList.add('inputBrand');
        this.brand.appendChild(inputBrand);
        
        this.licenseDiv = document.createElement('div');
        this.licenseDiv.className = 'licenseDiv';
    
        const inputLicense = document.createElement('input');
        inputLicense.setAttribute('type', 'text');
        inputLicense.setAttribute('id', 'license');
        inputLicense.setAttribute('placeholder', 'Unesite registarsku oznaku vozila');
        inputLicense.classList.add('inputLicense');
        this.licenseDiv.appendChild(inputLicense);
            
        this.color = document.createElement('div');
        this.color.className = 'color';
        const inputColor = document.createElement('select');
        inputColor.className = 'inputColor';
        this.colorDropdown(inputColor, this.color);

        this.model = document.createElement('div');
        this.model.className = 'model';
    
        const inputModel = document.createElement('input');
        inputModel.setAttribute('type', 'text');
        inputModel.setAttribute('id', 'model');
        inputModel.setAttribute('placeholder', 'Unesite model vozila');
        inputModel.classList.add('inputModel');
        this.model.appendChild(inputModel);
    
        const formConfirm = document.createElement('button');
        formConfirm.textContent = 'Potvrdi';
        formConfirm.className = "formConfirm";
    
        const form = document.createElement('div');
        form.className = 'form';
        form.appendChild(this.brand);
        form.appendChild(this.model);
        form.appendChild(this.licenseDiv);
        form.appendChild(this.color);
        form.appendChild(formConfirm);
        this.content.appendChild(form);
    
        var base = this;
        formConfirm.addEventListener('click', async () => {

            if (inputBrand.value == "" || inputModel.value == "" || inputLicense.value == "" || this.selectedPlaceID == null){
                
                if (inputModel.value == "")
                {
                    alert("Molimo unesite model vozila");
                }
                else if (inputLicense.value == "")
                {
                    alert("Molimo unesite registarsku oznaku vozila");
                }
                else if (inputBrand.value == "")
                {
                    alert("Molimo unesite marku vozila");
                }
                else if(this.selectedPlaceID == null){
                    alert("Molimo izaberite mesto za parkiranje vozila");
                }
            }
            else
            {
                const formData = {
                    brand: inputBrand.value,
                    model: inputModel.value,
                    license: inputLicense.value,
                    color: inputColor.value,
                    placeID: this.selectedPlaceID
                };
                //JSON sluzi da se forma prebaci u json format koji baza moze da procita
                //ovako se prebacuje forma u json
                const formDataJSON = JSON.stringify(formData)
                console.log(formDataJSON);
            
                // Slanje podataka na API endpoint
                fetch(`https://localhost:7138/api/Garage`, {
                method: 'POST',
                headers: {
                    //Ovo oznacava koji tip podataka se salje
                    'Content-Type': 'application/json'
                },
                body: formDataJSON,
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
                    base.updateParkingInfo();
                    this.selectedPlaceID = null;
                })
                .catch((error) => {
                    alert(error);
                    console.error(error);
                });
            }
        });
    }

    colorDropdown(inputColor, color) {
        color.appendChild(inputColor);

        const blackOption = document.createElement('option');
        blackOption.value = 'Crna';
        blackOption.text = 'Crna';
        inputColor.add(blackOption);

        const blueOption = document.createElement('option');
        blueOption.value = 'Plava';
        blueOption.text = 'Plava';
        inputColor.add(blueOption);

        const grayOption = document.createElement('option');
        grayOption.value = 'Siva';
        grayOption.text = 'Siva';
        inputColor.add(grayOption);

        const greenOption = document.createElement('option');
        greenOption.value = 'Zelena';
        greenOption.text = 'Zelena';
        inputColor.add(greenOption);

        const pinkOption = document.createElement('option');
        pinkOption.value = 'Roze';
        pinkOption.text = 'Roze';
        inputColor.add(pinkOption);

        const redOption = document.createElement('option');
        redOption.value = 'Crvena';
        redOption.text = 'Crvena';
        inputColor.add(redOption);

        const whiteOption = document.createElement('option');
        whiteOption.value = 'Bela';
        whiteOption.text = 'Bela';
        inputColor.add(whiteOption);

        const yellowOption = document.createElement('option');
        yellowOption.value = 'Zuta';
        yellowOption.text = 'Zuta';
        inputColor.add(yellowOption);

        const ostaloOption = document.createElement('option');
        ostaloOption.value = 'Ostalo';
        ostaloOption.text = 'Ostalo';
        inputColor.add(ostaloOption);
    }
    

    createParkingInfo(){
        this.parkingDiv = document.createElement('div');
        this.parkingDiv.className = 'parkingDiv';
        this.mainHeader.appendChild(this.parkingDiv);

        this.parkingInfo = document.createElement('div');
        this.parkingInfo.className = 'parkingInfo';
        this.parkingDiv.appendChild(this.parkingInfo);

        this.parkingStatus = document.createElement('div');
        this.parkingStatus.className = 'parkingStatus';
        this.parkingDiv.appendChild(this.parkingStatus);

        this.listParking.forEach((parking) => {
            this.spots += parking.freeSpace;
        });

        var pNode = document.createTextNode("P"); 
        var freeSpotsNode = document.createTextNode(this.spots); 
        this.parkingInfo.appendChild(pNode);
        this.parkingStatus.appendChild(freeSpotsNode);
    }


    async updateParkingInfo() {
        this.spots = 0;
        for (const parking of this.listParking) {
            await parking.updateSpots();
            this.spots = this.spots + parking.freeSpace;
        }
        const text = document.querySelector('.parkingStatus');    
        text.textContent = this.spots;
    }
}
