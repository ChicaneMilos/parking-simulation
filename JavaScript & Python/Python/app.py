from flask import Flask, request, session, jsonify, make_response
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta

konekcija = mysql.connector.connect(
    passwd = "",
    user = "root",
    database = "garaza",
    port = 3306,
    auth_plugin = 'mysql_native_password'
)

kursor = konekcija.cursor()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "neka_tajna_kao_ajde"

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        podaci = request.get_json()
        #lozinka = podaci.get('lozinka')

        #Hesiraj lozinku
        # hesovana_lozinka = generate_password_hash(lozinka)

        # #Zamijeni izvornu lozinku s hesiranom verzijom
        # podaci['lozinka'] = hesovana_lozinka

        upit = """
            INSERT INTO korisnik (jmbg, ime, prezime, role, email, lozinka) VALUES (%s, %s, %s, %s, %s, %s)
        """
        vrednosti = (
            podaci.get('jmbg'),
            podaci.get('ime'),
            podaci.get('prezime'),
            podaci.get('role'),
            podaci.get('email'),
            podaci.get('lozinka')
        )

        print(vrednosti)
        kursor.execute(upit, vrednosti)
        konekcija.commit()

        return jsonify({'status': 'Uspesno ubacen korisnik'})
    

@app.route('/login', methods=['POST'])
def login():
    podaci = request.get_json()
    email = podaci.get('email')
    sifra = podaci.get('lozinka')
    print(session)
    
    upit = "SELECT * FROM korisnik WHERE email=%s and lozinka = %s"
    print(f"Izvršavanje upita: {upit}, Vrednosti: ({email, sifra})")
    kursor.execute(upit, (email, sifra))
    korisnik = kursor.fetchone()
    print (korisnik)

    rezultat = None
    if korisnik:
    
        upit = "SELECT role FROM korisnik WHERE email = %s"
        kursor.execute(upit, (email,))
        rezultat = kursor.fetchone()

        session['ulogovani_korisnik'] = korisnik[0]
        print(session)
        odgovor = make_response(jsonify({'status': 'success', 'poruka': 'Uspesno provereno.', 'session': session, 'role' : rezultat}))
        odgovor.set_cookie('ulogovani_korisnik', str(korisnik[0]))
        return odgovor
    else:
        odgovor = jsonify({'status': 'error', 'poruka': 'Pogresan email ili lozinka.', 'session': session, 'role' : rezultat})
        return odgovor


@app.route('/getLevels', methods=['GET'])
def getLevels():
    upit = "SELECT * FROM parking"
    kursor.execute(upit)
    rezultat = kursor.fetchall()

    if len(rezultat) == 0:
        return jsonify([])

    columns = [column[0] for column in kursor.description]

    parking_data = []
    for row in rezultat:
        row_data = dict(zip(columns, row))
        parking_data.append(row_data)

        
        print(row_data)

    return jsonify(parking_data)


from flask import jsonify

@app.route('/getAllVehicles', methods=['GET'])
def getAllVehicles():
        upit = "SELECT * FROM vozilo"
        kursor.execute(upit)
        rezultat = kursor.fetchall()

        if len(rezultat) == 0:
            return jsonify([])
            
        vozilo_data = []
        for row in rezultat:
            vozilo = {
                'id': row[0],
                'brand': row[1],
                'model': row[2],
                'license': row[3],
                'color': row[4],
                'time': row[5],
                'id_korisnik': row[6],
                'id_parking': row[7],
                'mesto': row[8]
            }
            vozilo_data.append(vozilo)

        return jsonify(vozilo_data)


@app.route('/openInfoBox', methods=['GET'])
def openInfoBox():
    refresh_connection()  
    upit = "SELECT * FROM vozilo"
    kursor.execute(upit)
    rezultat = kursor.fetchall()

    if len(rezultat) == 0:
        return jsonify([]) 

    vozilo_data = []
    for row in rezultat:
        upit_nivo = "SELECT nivo FROM parking WHERE id=%s"
        kursor.execute(upit_nivo, (row[7],))
        nivo = kursor.fetchone()[0]

        vozilo = {
            'id': row[0],
            'brand': row[1],
            'model': row[2],
            'license': row[3],
            'color': row[4],
            'time': row[5],
            'id_korisnik': row[6],
            'nivo': nivo,
            'mesto': row[8]
        }
        vozilo_data.append(vozilo)

    return jsonify(vozilo_data)

@app.route('/GetRole', methods=['POST'])
def GetRole():

    data = request.json
    id = data.get('id')
    upit = "SELECT role FROM korisnik WHERE id = %s"
    kursor.execute(upit, (id,))
    rezultat = kursor.fetchone()

    if rezultat:
        role = rezultat[0]
        response = jsonify(role)
    else:
        response = jsonify('Nije pronadjeno.')
    return response

@app.route('/findParkingLevel', methods=['POST'])
def find_parking_level():
    data = request.json
    id_parking = data.get('id_parking')
    query = "SELECT nivo FROM parking WHERE id = %s"
    kursor.execute(query, (id_parking,))
    parking = kursor.fetchone()
    if parking:
        level = parking[0]
        response = jsonify(level)
    else:
        response = jsonify('Nije pronadjeno.')
    return response

@app.route('/addVehicle', methods=['POST'])
def addVehicle():
    podaci = request.get_json()
    brand = podaci.get('brand')
    model = podaci.get('model')
    license = podaci.get('license')
    color = podaci.get('color')
    ulogovani_korisnik = podaci.get('ulogovani_korisnik')
    parking_nivo = podaci.get('id_parking')
    mesto = podaci.get('placeID')

    # Dobijanje trenutnog vremena
    trenutno_vreme = datetime.now()
    trenutno_vreme = trenutno_vreme - timedelta(hours=1)

    # Formatiranje vremena u formatu za SQL datetime
    sql_format_vremena = trenutno_vreme.strftime('%Y-%m-%d %H:%M:%S')

   
   #Nalazimo ID od parking nivoa
    upit_parking_id = "SELECT id FROM parking WHERE nivo = %s"
    kursor.execute(upit_parking_id, (parking_nivo,))
    result = kursor.fetchone()
    parking_id = result[0]
    print('nadjen parking id je ' + str(parking_id))

    #Smanjuje broj slobodnih za 1
    upit_parking_id = "UPDATE parking SET br_slobodnih = br_slobodnih - 1 WHERE id = %s"
    kursor.execute(upit_parking_id, (parking_id,))
    konekcija.commit()  # Sačuvaj promene u bazi

    #Povecavamo broj zauzetih za 1
    upit_parking_id = "UPDATE parking SET br_zauzetih = br_zauzetih + 1 WHERE id = %s"
    kursor.execute(upit_parking_id, (parking_id,))
    konekcija.commit()  # Sačuvaj promene u bazi


    upit = "INSERT INTO vozilo (brand, model, license, color, time, id_korisnik, id_parking, mesto) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    kursor.execute(upit, (brand, model, license, color, sql_format_vremena, ulogovani_korisnik, parking_id, mesto))

    konekcija.commit() 
    odgovor = jsonify({'status': 'success', 'poruka': 'Ubacen vozilo.'})
   
    return odgovor

@app.route('/removeVehicle', methods=['POST'])
def removeVehicle():

    podaci = request.get_json()
    id = podaci.get('Id')
    print('id za brisanje je ' + str(id))

    upit_parking_id = "SELECT id_parking FROM vozilo WHERE id = %s"
    kursor.execute(upit_parking_id, (id,))
    result = kursor.fetchone()
    parking_id = result[0]
    print('nadjen parking id je ' + str(parking_id))


    #Smanjuje broj slobodnih za 1
    upit_parking_id = "UPDATE parking SET br_slobodnih = br_slobodnih + 1 WHERE id = %s"
    kursor.execute(upit_parking_id, (parking_id,))
    konekcija.commit()  

    #Povecavamo broj zauzetih za 1
    upit_parking_id = "UPDATE parking SET br_zauzetih = br_zauzetih - 1 WHERE id = %s"
    kursor.execute(upit_parking_id, (parking_id,))
    konekcija.commit()  

    
    upit = "DELETE FROM vozilo WHERE id = %s"
    kursor.execute(upit, (id,))

    konekcija.commit()  
    odgovor = jsonify({'status': 'success', 'poruka': 'Izbrisano vozilo.'})
    
    return odgovor

@app.route('/freeSpaces', methods=['GET'])
def freeSpaces():
    upit = "SELECT * FROM parking"
    kursor.execute(upit)
    rezultati = kursor.fetchall()
    parking_mesta = [{'id': row[0], 'nivo': row[1], 'ime': row[2], 'br_mesta': row[3], 'br_slobodnih': row[4], 'br_zauzetih': row[5]} for row in rezultati]
    
    return jsonify({'parking_mesta': parking_mesta})

@app.route('/updateVehicle', methods=['POST'])
def updateVehicle():
    podaci = request.get_json()
    id = podaci.get('Id')
    brand = podaci.get('brand')
    model = podaci.get('model')
    license = podaci.get('license')
    color = podaci.get('color')
    parking_nivo = podaci.get('parkingID')
    mesto = podaci.get('placeID')

    #Uzima id od parkinga preko njegovog nivoa i stavlja ga u tabelu vozilo
    upit_parking_id = "SELECT id FROM parking WHERE nivo = %s"
    kursor.execute(upit_parking_id, (parking_nivo,))
    result = kursor.fetchone()
    parking_id = result[0] 
    print('nadjen parking id je ' + str(parking_id))

    upit = "UPDATE vozilo SET brand = %s, model = %s, license = %s, color = %s, id_parking = %s, mesto = %s WHERE id = %s"
    kursor.execute(upit, (brand, model, license, color, parking_id, mesto, id))

    konekcija.commit() 
    odgovor = jsonify({'status': 'success', 'poruka': 'Updated vozilo.'})
    
    return odgovor

@app.route('/addParkingLevel', methods=['POST'])
def addParking():
    podaci = request.get_json()
    name = podaci.get('name')

    
    max_nivo_upit = "SELECT MAX(nivo) FROM parking"
    kursor.execute(max_nivo_upit)
    max_nivo_rezultat = kursor.fetchone()
    max_nivo = max_nivo_rezultat[0] if max_nivo_rezultat else 0

    if max_nivo is not None:
        nivo = max_nivo + 1
    else:
        nivo = 1
    
    upit = "INSERT INTO parking (nivo, ime, br_mesta, br_slobodnih, br_zauzetih) VALUES (%s, %s, 22, 22, 0)"
    print(f"Izvršavanje upita: {upit}, Vrednosti: ({nivo}, {name})")
    kursor.execute(upit, (nivo, name))
    
    konekcija.commit() 
    odgovor = jsonify({'status': 'success', 'poruka': 'Ubacen parking.'})
    return odgovor

@app.route('/removeParkingLevel', methods=['POST'])
def removeParking():
    podaci = request.get_json()
    level = podaci.get('level')

    upit = "SELECT id FROM parking WHERE nivo = %s"
    kursor.execute(upit, (level,))
    result = kursor.fetchone()
    parkingID = result[0]

    upit = "DELETE FROM vozilo WHERE id_parking = %s"
    kursor.execute(upit, (parkingID,))

    upit = "DELETE FROM parking WHERE nivo = %s"
    print(f"Izvršavanje upita: {upit}, Vrednosti: ({level})")
    kursor.execute(upit, (level,))
    
    # Ažuriranje preostalih nivoa
    update_upit = "UPDATE parking SET nivo = nivo - 1 WHERE nivo > %s"
    print(f"Izvršavanje upita: {update_upit}, Vrednosti: ({level})")
    kursor.execute(update_upit, (level,))
    
    konekcija.commit()
    odgovor = jsonify({'status': 'success', 'poruka': 'Izbrisan parking.'})
    return odgovor

@app.route('/logout')
def logout():
    session.pop('ulogovani_korisnik', None)
    odgovor = {'status': 'success', 'poruka': 'Uspešno ste se izlogovali.'}
    response = make_response(jsonify(odgovor))
    expires_date = datetime.now() - timedelta(days=1)
    response.set_cookie('ulogovani_korisnik', '', expires=expires_date)

    return response

def refresh_connection():
    global konekcija, kursor
    konekcija.close()
    konekcija = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="garaza"
    )
    kursor = konekcija.cursor()

    

app.run(debug=True)