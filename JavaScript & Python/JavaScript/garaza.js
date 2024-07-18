import { parking } from "./parking.js";
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
        this.logUserOut = this.logUserOut.bind(this);
        this.carData = "";
        this.carNivo = 0;
        this.parkingID = 0;
        this.spotNumber = 1;
        this.role = '';
    }
    

    
static logout() {
    fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status === 'success') {
            console.log('Uspešno ste se izlogovali.');
            deleteCookie('ulogovani_korisnik');
            //window.location.reload();
            // Dodajte ovde kod za prikazivanje poruke korisniku ili za ažuriranje UI
        } else {
            console.error('Neuspešno izlogovanje.');
            // Dodajte ovde kod za prikazivanje poruke korisniku ili za ažuriranje UI
        }
    })
    .catch((error) => {
        console.error('Greška prilikom izvršavanja izlogovanja:', error);
        // Dodajte ovde kod za prikazivanje poruke korisniku ili za ažuriranje UI
    });
}

    addParking(parking) {
        this.listParking.push(parking);
    }


    drawBaseParking(){
        const instance = this;
        this.listParking = [];
        this.floorController = document.createElement('div');
        this.floorController.className = 'floorController';
        this.parkingLot.appendChild(this.floorController);
        this.createParkingInfo();

        getLevels();

        async function getLevels() {

            // Fetch poziv za slanje podataka na server
            fetch('http://localhost:5000/getLevels', {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
              console.log('Odgovor od servera:', data);
              
                  console.log("level dodat")
                  
                  instance.drawLevelBase(data, instance);
              
           

      
            })
            .catch((error) => {
                console.error('Greška prilikom slanja podataka:', error);
            });

        }


    }

    drawParkingNEW(data){

        const instance = this;
            const park = new parking(this.role);
            park.createParking(5,8, instance.parkingLot, instance);
            const floorButton = document.createElement('button');
            floorButton.className = "floorButton";
            floorButton.textContent = instance.listParking.length + 1;
            instance.floorController.appendChild(floorButton);
            instance.addParking(park);

            floorButton.addEventListener('click', () => {
                instance.showFloor(floorButton.textContent);
            });

            instance.showFloor(1);
            console.log("NACRTAN!");

    }

    drawParkingManager(){
        if (this.role != "Guest" && this.role != "User")
        {
            this.parkingManagerButtonDiv = document.createElement('div');
            this.parkingManagerButtonDiv.className = 'parkingManagerButtonDiv';
            this.parkingLot.appendChild(this.parkingManagerButtonDiv);
    
            this.parkingManagerButton = document.createElement('button');
            this.parkingManagerButton.className = 'parkingManagerButton';
            this.parkingManagerButton.textContent = 'Upravljaj parkinzima'
            this.parkingManagerButtonDiv.appendChild(this.parkingManagerButton);
    
            this.parkingManagerButton.addEventListener('click', () => {
                this.openParkingManager();
            });
        }



    }

    showFloor(value){
        //this.updateParkingInfo();
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

    logUserOut() {
        fetch('http://localhost:5000/logout', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.status === 'success') {
                console.log('Uspešno ste se izlogovali.');
                this.deleteCookie('ulogovani_korisnik');  // Obratite pažnju na this ovde
            } else {
                console.error('Neuspešno izlogovanje.');
            }
        })
        .catch((error) => {
            console.error('Greška prilikom izvršavanja izlogovanja:', error);
        });
    }

    deleteCookie(name) {
        console.log('DeleteCookie CALLED');
        document.cookie = "ulogovani_korisnik=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    }
    
    
    deleteCookie() {
        console.log("DELETING COOKIES!!");
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
        window.location.reload();
    };



    createBase(gde){

        var instance = this;
        this.page = document.createElement('div');
        this.page.className = 'page';
        gde.appendChild(this.page)
    
        this.logout = document.createElement('div');
        this.logout.className = 'logout';
        this.page.appendChild(this.logout)
    
        this.logoutButton = document.createElement('button');
        this.logoutButton.className = 'logoutButton';
        this.logoutButton.textContent = "Log out";
        this.logout.appendChild(this.logoutButton)
    
        this.logoutButton.addEventListener('click', () => {

            this.deleteCookie();



        });
       

    
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
    
        if (this.role != "Guest")
        {
            this.content = document.createElement('div');
            this.content.className = 'content';
            this.mainContent.appendChild(this.content);
        }

    
        this.parkingLot = document.createElement('div');
        this.parkingLot.className = 'parking-lot';
        this.mainContent.appendChild(this.parkingLot);
    
        if (this.role != "Guest")
        this.addVehicle();
    }
    
    

    addVehicle() {

        const instance = this;
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

            const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
            const ulogovaniKorisnikCookie = cookies.find(cookie => cookie[0].trim() === 'ulogovani_korisnik');
    
            if (ulogovaniKorisnikCookie) {
                var ulogovaniKorisnikVrednost = ulogovaniKorisnikCookie[1];
                console.log('Vrednost kolačića ulogovani_korisnik:', ulogovaniKorisnikVrednost);
            } else {
                console.log('Kolačić ulogovani_korisnik nije postavljen.');
            }

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
                    ulogovani_korisnik: ulogovaniKorisnikVrednost, 
                    id_parking: this.currentLevel,
                    placeID: this.selectedPlaceID
                };
                //JSON sluzi da se forma prebaci u json format koji baza moze da procita
                //ovako se prebacuje forma u json
                const formDataJSON = JSON.stringify(formData)
                console.log(formDataJSON);
            
                // Slanje podataka na API endpoint
                fetch('http://localhost:5000/addVehicle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
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
                    console.log("Ubaceno!!!");
                    window.location.reload();
                    this.selectedPlaceID = null;
                    //getLevels();
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

    roleDropdown(inputRole, role) {
        role.appendChild(inputRole);

        const userOption = document.createElement('option');
        userOption.value = 'User';
        userOption.text = 'User';
        inputRole.add(userOption);

        const adminOption = document.createElement('option');
        adminOption.value = 'Admin';
        adminOption.text = 'Admin';
        inputRole.add(adminOption);

        const guestOption = document.createElement('option');
        guestOption.value = 'Guest';
        guestOption.text = 'Guest';
        inputRole.add(guestOption);
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

        
        this.drawParkingManager();


    }

    async updateParkingInfo() {
        await fetch('http://localhost:5000/freeSpaces', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Odgovor od servera:', data);
    
            // Sabiranje slobodnih mesta
            const slobodnaMesta = data.parking_mesta.reduce((acc, curr) => acc + curr.br_slobodnih, 0);
            console.log('Ukupno slobodnih mesta:', slobodnaMesta);
    
            // Prikazivanje ukupnog broja slobodnih mesta
            const text = document.querySelector('.parkingStatus');    
            text.textContent = slobodnaMesta;
        })
        .catch((error) => {
            console.error('Greška prilikom slanja podataka:', error);
        });
    }
    

    
    

    // Funkcija koja proverava postojanje kolačića nakon određenog vremena
     checkCookieAfterDelay(cookieName, delay) {
        setTimeout(() => {
        const cookieExists = this.checkCookieExists(cookieName);
        if (cookieExists) {
            console.log('Kolačić postoji.');
            this.drawLoginSignup(false);
        } else {
            console.log('Kolačić ne postoji.');
            this.drawLoginSignup(true);
        }
    }, delay);
}

    checkCookieExists(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Provera da li kolačić počinje sa traženim imenom
            if (cookie.startsWith(cookieName + '=')) {
                return true;
            }
        }
        return false;
    }

    async getRoleFunc(){
        const instance = this;
        const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
        const ulogovaniKorisnikCookie = cookies.find(cookie => cookie[0].trim() === 'ulogovani_korisnik');
    
        if (ulogovaniKorisnikCookie) {
            var ulogovaniKorisnikVrednost = ulogovaniKorisnikCookie[1];
            console.log('Vrednost kolačića ulogovani_korisnik:', ulogovaniKorisnikVrednost);
    
            await GetRole(ulogovaniKorisnikVrednost); // Dodajte ovu liniju da sačekate fetch poziv
    
            
        } else {
            console.log('Kolačić ulogovani_korisnik nije postavljen.');
        }
    
        async function GetRole(id) {
            const podaci = {
                id: id,
            };
    
            await fetch('http://localhost:5000/GetRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(podaci),
                credentials: 'include',
            })
            .then((response) => {
                if (!response.ok){
                    if (response.status == 400) {
                        throw new Error(`Uneti podaci su neispravni!`);
                    } else {
                        throw new Error(`Network response was not ok ${response.status}`);
                    }
                }
                return response.json();
            })
            .then((data) => {
                console.log("Preuzeta uloga:", data);
                instance.role = data; // Postavite vrednost role u instance.role
            })
            .catch((error) => {
                alert(error);
                console.error(error);
            });
        }
    }

    async drawLoginSignup(state){
        const instance = this;

        await this.getRoleFunc();


        console.log("Ulogovani korisnik ima ulogu:", this.role);
        if (state == true)
        {
            const instance = this;

        this.welcomeDiv = document.createElement('div');
        this.welcomeDiv.className = 'welcomeDiv';
        document.body.appendChild(this.welcomeDiv);        


        this.welcomeHeader = document.createElement('div');
        this.welcomeHeader.className = 'welcomeHeader';
        this.welcomeDiv.appendChild(this.welcomeHeader);
        var tekst = 'Prijavi se';
        var textNode = document.createTextNode(tekst); 
        this.welcomeHeader.appendChild(textNode);
        

        this.welcomeContent = document.createElement('div');
        this.welcomeContent.className = 'welcomeContent';
        this.welcomeDiv.appendChild(this.welcomeContent);

        this.loginEmailInput = document.createElement('input');
        this.loginEmailInput.className = 'loginEmailInput';
        this.loginEmailInput.placeholder = 'E-Mail';
        this.welcomeContent.appendChild(this.loginEmailInput);

        this.loginPasswordInput = document.createElement('input');
        this.loginPasswordInput.type = "password";
        this.loginPasswordInput.className = 'loginPasswordInput';
        this.loginPasswordInput.placeholder = 'Lozinka';
        this.welcomeContent.appendChild(this.loginPasswordInput);

        this.confirmLogin = document.createElement('button');
        this.confirmLogin.className = 'confirmLogin';
        this.confirmLogin.textContent = 'Prijavi se';
        this.welcomeContent.appendChild(this.confirmLogin);

        this.noAcc = document.createElement('div');
        this.noAcc.className = 'noAcc';
        this.noAcc.textContent = 'Nemate nalog?'
        this.welcomeContent.appendChild(this.noAcc);

        this.registerSignup = document.createElement('button');
        this.registerSignup.className = 'registerSignup';
        this.registerSignup.textContent = 'Registruj se';
        this.welcomeContent.appendChild(this.registerSignup);

        this.errorText = document.createElement('div');
        this.errorText.className = 'errorText';
        this.welcomeDiv.appendChild(this.errorText);

        this.registerSignup.addEventListener('click', () => {
            this.welcomeDiv.remove();
            this.drawRegisterSignup();
        });

        this.confirmLogin.addEventListener('click', () => {
            if (this.loginEmailInput.value == "" || this.loginPasswordInput.value == "")
            {
                alert("Molimo unesite sva polja!")
            }
            else{
                proveraLogin();
            }
            
        });

        async function proveraLogin() {
            const emailLogin = document.querySelector('.loginEmailInput').value;
            const lozinkaLogin = document.querySelector('.loginPasswordInput').value;
            const podaci = {
              email: emailLogin,
              lozinka: lozinkaLogin
              
              };
              console.log(JSON.stringify(podaci));
              // Fetch poziv za slanje podataka na server
              fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(podaci),
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
                console.log('Odgovor od servera:', data);
                if (data.status === 'success') {
                    document.cookie = `ulogovani_korisnik=${data.session['ulogovani_korisnik']};`;
                    console.log("sucess")
                    instance.role = data.role;
                    console.log('rola je ' + instance.role);
                    instance.welcomeDiv.remove();
   
                        instance.createBase(document.body);
                    

                    instance.drawBaseParking();
                } else {
                    console.log("not success")
                    instance.errorText.textContent = data.poruka;
                }
            })
            .catch((error) => {
                console.error('Greška prilikom slanja podataka:', error);
                this.errorText.textContent = "Greška prilikom slanja podataka";
            });

              
            }
        
        }
        else{

                this.createBase(document.body);
            

            this.drawBaseParking();
        }
        
    }


    drawRegisterSignup(){

        const instance = this;

        this.registerDiv = document.createElement('div');
        this.registerDiv.className = 'registerDiv';
        document.body.appendChild(this.registerDiv);        

        this.registerHeader = document.createElement('div');
        this.welcomeHeader.className = 'registerHeader';
        this.registerDiv.appendChild(this.registerHeader);
        var tekst = 'Registruj se';
        var textNode = document.createTextNode(tekst); 
        this.registerHeader.appendChild(textNode);

        this.registerContent = document.createElement('div');
        this.registerContent.className = 'registerContent';
        this.registerDiv.appendChild(this.registerContent);

        this.registerJMBGInput = document.createElement('input');
        this.registerJMBGInput.className = 'registerJMBGInput';
        this.registerJMBGInput.placeholder = 'JMBG';
        this.registerContent.appendChild(this.registerJMBGInput);

        this.registerEmailInput = document.createElement('input');
        this.registerEmailInput.className = 'registerEmailInput';
        this.registerEmailInput.placeholder = 'E-Mail';
        this.registerContent.appendChild(this.registerEmailInput);

        this.registerPasswordInput = document.createElement('input');
        this.registerPasswordInput.className = 'registerPasswordInput';
        this.registerPasswordInput.placeholder = 'Lozinka';
        this.registerContent.appendChild(this.registerPasswordInput);

        this.registerImeInput = document.createElement('input');
        this.registerImeInput.className = 'registerImeInput';
        this.registerImeInput.placeholder = 'Ime';
        this.registerContent.appendChild(this.registerImeInput);

        this.registerPrezimeInput = document.createElement('input');
        this.registerPrezimeInput.className = 'registerPrezimeInput';
        this.registerPrezimeInput.placeholder = 'Prezime';
        this.registerContent.appendChild(this.registerPrezimeInput);

        this.registerRoleInputDIV = document.createElement('div');
        this.registerRoleInputDIV.className = 'registerRoleInputDIV';
        this.registerContent.appendChild(this.registerRoleInputDIV);

        this.registerRoleInput = document.createElement('select');
        this.registerRoleInput.className = "registerRoleInput";
        //this.registerRoleInput.value = color;
        //this.registerRoleInput.textContent = color;
        this.roleDropdown(this.registerRoleInput, this.registerRoleInputDIV);

        this.confirmRegister = document.createElement('button');
        this.confirmRegister.className = 'confirmRegister';
        this.confirmRegister.textContent = 'Registruj se';
        this.registerContent.appendChild(this.confirmRegister);

        this.noAcc = document.createElement('div');
        this.noAcc.className = 'noAcc';
        this.noAcc.textContent = 'Imas nalog?'
        this.registerContent.appendChild(this.noAcc);

        
        this.loginSignup = document.createElement('button');
        this.loginSignup.className = 'loginSignup';
        this.loginSignup.textContent = 'Prijavi se';
        this.registerContent.appendChild(this.loginSignup);

        this.loginSignup.addEventListener('click', () => {
            this.registerDiv.remove();
            this.checkCookieAfterDelay('ulogovani_korisnik', 500);
        });

        this.confirmRegister.addEventListener('click', () => {
            if (this.registerJMBGInput.value == "" || this.registerEmailInput.value == "" || this.registerPasswordInput.value == "" || this.registerPrezimeInput.value == "" || this.registerImeInput.value == "")
            {
                alert("Molimo unesite sva potrebna polja za registraciju!")
            }
            else{
                posaljiPodatke();
            }
            
        });


        async function posaljiPodatke() {
            {
              const poljeJMBG = document.querySelector('.registerJMBGInput').value;
              const poljeIme = document.querySelector('.registerImeInput').value;
              const poljePrezime = document.querySelector('.registerPrezimeInput').value;
              const poljeRola = document.querySelector('.registerRoleInput').value;
              const poljeEmail = document.querySelector('.registerEmailInput').value;
              const poljeLoznika = document.querySelector('.registerPasswordInput').value;
              const podaci = {
                jmbg: poljeJMBG,
                ime: poljeIme,
                prezime: poljePrezime,
                role: poljeRola,
                email: poljeEmail,
                lozinka: poljeLoznika
                
                };
                console.log(JSON.stringify(podaci));
                // Fetch poziv za slanje podataka na server
                fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(podaci),
                })
                .then(response => response.json())
                .then(data => {
                  console.log('Odgovor od servera:', data);
                  instance.registerDiv.remove();
                  
                  instance.drawLoginSignup(true);
                })
                .catch((error) => {
                    console.error('Greška prilikom slanja podataka:', error);
                });
              }
          }
    }

    openParkingManager(){
        var levelData;
        this.parkingID = 0;
        const instance = this;
        this.parkingManagerDiv = document.createElement('div');
        this.parkingManagerDiv.className = 'parkingManagerDiv';
        document.body.appendChild(this.parkingManagerDiv);

        this.parkingManager = document.createElement('div');
        this.parkingManager.className = 'parkingManager';
        this.parkingManagerDiv.appendChild(this.parkingManager);

        this.parkingManagerCloseButton = document.createElement('div');
        this.parkingManagerCloseButton.className = 'parkingManagerCloseButton';
        this.parkingManager.appendChild(this.parkingManagerCloseButton);

        const button = document.createElement('button');
        button.className = "XButton";
        button.textContent = 'X';
        this.parkingManagerCloseButton.appendChild(button);

        button.addEventListener('click', () => {
            this.parkingManagerDiv.remove();
        });

        this.parkingManagerHeader = document.createElement('div');
        this.parkingManagerHeader.className = 'parkingManagerHeader';
        this.parkingManager.appendChild(this.parkingManagerHeader);
        var tekst = 'Upravljanje parkinzima';
        var textNode = document.createTextNode(tekst); 
        this.parkingManagerHeader.appendChild(textNode);

        this.parkingManagerAddParking = document.createElement('div');
        this.parkingManagerAddParking.className = 'parkingManagerAddParking';
        this.parkingManager.appendChild(this.parkingManagerAddParking);

        this.parkingManagerContent = document.createElement('div');
        this.parkingManagerContent.className = 'parkingManagerContent';
        this.parkingManager.appendChild(this.parkingManagerContent);

        this.parkingManagerButtons = document.createElement('div');
        this.parkingManagerButtons.className = 'parkingManagerButtons';
        this.parkingManager.appendChild(this.parkingManagerButtons);

        this.addParkingName = document.createElement('input');
        this.addParkingName.className = 'addParkingName';
        this.addParkingName.placeholder = 'Ime parkinga';
        this.parkingManagerAddParking.appendChild(this.addParkingName);

        this.addParkingLevel = document.createElement('button');
        this.addParkingLevel.className = 'addParkingLevel';
        this.addParkingLevel.textContent = "Dodaj parking";
        this.parkingManagerAddParking.appendChild(this.addParkingLevel);


        this.listParking = [];

        getLevels();

        this.addParkingLevel.addEventListener('click', (event) => {
            //this.parkingManagerDiv.remove();
            addLevel();

        })


        
        async function getLevels() {

              // Fetch poziv za slanje podataka na server
              fetch('http://localhost:5000/getLevels', {
                  method: 'GET',
                  credentials: 'include',
              })
              .then(response => response.json())
              .then(data => {
                console.log('Odgovor od servera:', data);
                
                    console.log("level dodat")
                    levelData = data;
                    instance.drawLevel(data);
                
             

        
              })
              .catch((error) => {
                  console.error('Greška prilikom slanja podataka:', error);
              });

              
            }


            
            
            

        async function addLevel() {
            const parkingName = document.querySelector('.addParkingName').value;
            console.log('parking ime' + parkingName);
            const podaci = {
              name: parkingName
              };
              console.log(JSON.stringify(podaci));
              // Fetch poziv za slanje podataka na server
              fetch('http://localhost:5000/addParkingLevel', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(podaci),
                  credentials: 'include',
              })
              .then(response => response.json())
              .then(data => {
                console.log('Odgovor od servera:', data);
                if (data.status === 'success')
                {
                    console.log("level dodat")
                    window.location.reload();

                }
                else
                {
                    console.log("not success")
                }

        
              })
              .catch((error) => {
                  console.error('Greška prilikom slanja podataka:', error);
              });

              
            }
    }

    async drawLevel(data) {
        var i = 0;
        this.spotNumber = 1;
        const instance = this;

        // while (this.floorController.firstChild) {
        //     this.floorController.removeChild(this.floorController.firstChild);
        // }

        // var elements = document.querySelectorAll('.parkingSpaces'); 
        // elements.forEach(element => {
        //     element.remove();
        // });
        
        i = 0;
        console.log("called")
        data.forEach(result => {
            i++;
            console.log(i);
            //this.drawParkingNEW();

            console.log('drawn' + result);
            let levelDIV = document.createElement('div');
            levelDIV.className = 'levelDIV';
            this.parkingManagerContent.appendChild(levelDIV);

            let levelContent = document.createElement('div');
            levelContent.className = 'levelContent';
            levelDIV.appendChild(levelContent);

            let levelNivo = document.createElement('div');
            levelNivo.className = 'levelNivo';
            levelNivo.textContent = 'Nivo: ' + result.nivo;
            levelContent.appendChild(levelNivo);

            let levelNaziv = document.createElement('div');
            levelNaziv.className = 'levelNaziv';
            levelNaziv.textContent = 'Naziv: ' + result.ime;
            levelContent.appendChild(levelNaziv);

            let levelBrMesta = document.createElement('div');
            levelBrMesta.className = 'levelBrMesta';
            levelBrMesta.textContent = 'Broj mesta: ' + result.br_mesta;
            levelContent.appendChild(levelBrMesta);

            let levelBrSlobodnih = document.createElement('div');
            levelBrSlobodnih.className = 'levelBrSlobodnih';
            levelBrSlobodnih.textContent = 'Broj slobodnih: ' + result.br_slobodnih;
            levelContent.appendChild(levelBrSlobodnih);

            let levelBrZauzetih = document.createElement('div');
            levelBrZauzetih.className = 'levelBrZauzetih';
            levelBrZauzetih.textContent = 'Broj zauzetih: ' + result.br_zauzetih;
            levelContent.appendChild(levelBrZauzetih);

            let levelIzbrisi = document.createElement('button');
            levelIzbrisi.className = 'levelIzbrisi';
            levelIzbrisi.textContent = 'Izbrisi parking';
            levelContent.appendChild(levelIzbrisi);

            levelIzbrisi.addEventListener('click', (event) => {
                //this.parkingManagerDiv.remove();
                console.log('Remove level calling on ' + result.nivo)
                removeLevel(result.nivo);
    
            })

        });


        function removeDivsByClassName(className) {
            var divsToRemove = document.getElementsByClassName(className);
            while (divsToRemove.length > 0) {
                divsToRemove[0].parentNode.removeChild(divsToRemove[0]);
            }
        }
        
        // Poziv funkcije za uklanjanje divova sa određenim imenom klase
        removeDivsByClassName('parkingSpaces');
        removeDivsByClassName('floorButton');
        
        
        while (this.floorController.firstChild) {
            this.floorController.removeChild(this.floorController.firstChild);
        }

        var elements = document.querySelectorAll('.parkingSpaces'); 
        elements.forEach(element => {
            element.remove();
        });
        

        console.log("called")
        data.forEach(result => {
            //i++;
            console.log(i);
            //this.drawParkingNEW();

            console.log('drawn' + result);
            
        });

        for (var j = 0; j<i; j++)
        {
            console.log('fored');
            await this.drawParkingNEW();
        }

        await getAllVehicles()

        async function getAllVehicles() {
            try {
                // Fetch poziv za slanje podataka na server
                const response = await fetch('http://localhost:5000/getAllVehicles', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Odgovor od servera:', data);
                
                console.log("Vozila preuzeta!!!");
                console.log(data);
                instance.carData = data;
        
                for (const result of data) {
                    await findParkingLevel(result.id_parking);
                    console.log("trying to find with " + instance.carNivo);
                    const element = document.querySelector(`.parkingSpaces[id="${instance.carNivo}"]`);
                    console.log(element);
                    console.log("i sa mestom " + result.mesto);
                    const childElement = element.querySelector(`.spot[id="${result.mesto}"]`);
                    console.log(childElement);
                    //childElement.childNodes[0].textContent = 'odje'

                    childElement.classList.remove('spot');
                    childElement.classList.add('parked-spot');
                    childElement.childNodes[0].classList.add("hidden");
        
                    var colorTrimmed = result.color.trim();
                    switch (colorTrimmed) {
                        case 'Crna':
                            childElement.classList.add('parkedBlack');
                            break;
                        case 'Plava':
                            childElement.classList.add('parkedBlue');
                            break;
                        case 'Siva':
                            childElement.classList.add('parkedGray');
                            break;
                        case 'Zelena':
                            childElement.classList.add('parkedGreen');
                            break;
                        case 'Ostalo':
                            childElement.classList.add('parkedOstalo');
                            break;
                        case 'Roze':
                            childElement.classList.add('parkedPink');
                            break;
                        case 'Crvena':
                            childElement.classList.add('parkedRed');
                            break;
                        case 'Bela':
                            childElement.classList.add('parkedWhite');
                            break;
                        case 'Zuta':
                            childElement.classList.add('parkedYellow');
                            break;
                    }
                        //console.log(childElement.childNodes[0].textContent = 'odje');
                        console.log('mesto je ' + result.mesto)

                    }
            
            } catch (error) {
                console.error('Greška prilikom slanja podataka:', error);
            }
        }
        
        async function findParkingLevel(id_parking) {
            try {
                console.log("trying to find parking with id " + id_parking);
                const podaci = {
                    id_parking: id_parking,
                };
                console.log(JSON.stringify(podaci));
                // Fetch poziv za slanje podataka na server
                const response = await fetch('http://localhost:5000/findParkingLevel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(podaci),
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Odgovor od servera:', data);
                instance.carNivo = data - 1;
        
            } catch (error) {
                console.error('Greška prilikom slanja podataka:', error);
            }
        }
        

        async function removeLevel(nivo) {
            console.log('NIVO: ' + nivo);
            const podaci = {
              level: nivo
              };
              console.log(JSON.stringify(podaci));
              // Fetch poziv za slanje podataka na server
              fetch('http://localhost:5000/removeParkingLevel', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(podaci),
                  credentials: 'include',
              })
              .then(response => response.json())
              .then(data => {
                console.log('Odgovor od servera:', data);
                if (data.status === 'success')
                {
                    console.log("level izbrisan")
                    window.location.reload();
                }
                else
                {
                    console.log("not success")
                }

        
              })
              .catch((error) => {
                  console.error('Greška prilikom slanja podataka:', error);
              });

              
            }
    }
    


    async drawLevelBase(data) {
        var i = 0;
        const instance = this;

        while (this.floorController.firstChild) {
            this.floorController.removeChild(this.floorController.firstChild);
        }

        var elements = document.querySelectorAll('.parkingSpaces'); 
        elements.forEach(element => {
            element.remove();
        });
        

        console.log("called")
        data.forEach(result => {
            i++;
            console.log(i);
            //this.drawParkingNEW();

            console.log('drawn' + result);
            
        });

        for (var j = 0; j<i; j++)
        {
            console.log('fored');
            this.drawParkingNEW();
        }

        await getAllVehicles()

        this.updateParkingInfo();

        async function getAllVehicles() {
            try {
                // Fetch poziv za slanje podataka na server
                const response = await fetch('http://localhost:5000/getAllVehicles', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Odgovor od servera:', data);
                
                console.log("Vozila preuzeta");
                console.log(data);
                instance.carData = data;
        
                for (const result of data) {
                    await findParkingLevel(result.id_parking);
                    console.log("trying to find with " + instance.carNivo);
                    const element = document.querySelector(`.parkingSpaces[id="${instance.carNivo}"]`);
                    const childElement = element.querySelector(`.spot[id="${result.mesto}"]`);
                    console.log(childElement);
                    //childElement.childNodes[0].textContent = 'odje'

                    childElement.classList.remove('spot');
                    childElement.classList.add('parked-spot');
                    childElement.childNodes[0].classList.add("hidden");
        
                    var colorTrimmed = result.color.trim();
                    switch (colorTrimmed) {
                        case 'Crna':
                            childElement.classList.add('parkedBlack');
                            break;
                        case 'Plava':
                            childElement.classList.add('parkedBlue');
                            break;
                        case 'Siva':
                            childElement.classList.add('parkedGray');
                            break;
                        case 'Zelena':
                            childElement.classList.add('parkedGreen');
                            break;
                        case 'Ostalo':
                            childElement.classList.add('parkedOstalo');
                            break;
                        case 'Roze':
                            childElement.classList.add('parkedPink');
                            break;
                        case 'Crvena':
                            childElement.classList.add('parkedRed');
                            break;
                        case 'Bela':
                            childElement.classList.add('parkedWhite');
                            break;
                        case 'Zuta':
                            childElement.classList.add('parkedYellow');
                            break;
                    }
                        //console.log(childElement.childNodes[0].textContent = 'odje');
                        console.log('mesto je ' + result.mesto)

                    }
            
            } catch (error) {
                console.error('Greška prilikom slanja podataka:', error);
            }
        }
        
        async function findParkingLevel(id_parking) {
            try {
                console.log("trying to find parking with id " + id_parking);
                const podaci = {
                    id_parking: id_parking,
                };
                console.log(JSON.stringify(podaci));
                // Fetch poziv za slanje podataka na server
                const response = await fetch('http://localhost:5000/findParkingLevel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(podaci),
                    credentials: 'include',
                });
                const data = await response.json();
                console.log('Odgovor od servera:', data);
                instance.carNivo = data - 1;
        
            } catch (error) {
                console.error('Greška prilikom slanja podataka:', error);
            }
        }
    }        

    
}
