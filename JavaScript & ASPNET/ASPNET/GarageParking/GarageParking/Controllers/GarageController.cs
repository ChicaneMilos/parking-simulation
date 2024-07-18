//Using direktive neke se koriste neke ne
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
//Ova sluzi za apicontrollere
using Microsoft.AspNetCore.Mvc;
//Ukljucujemo Garage.cs iz folder entities
using GarageParking.Entities;
using System.Reflection.Metadata.Ecma335;
using static System.Runtime.InteropServices.JavaScript.JSType;
using GarageParking.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using System;
using System.Diagnostics;

//Novi namespace u folder controllers
namespace GarageParking.Controllers
{
    [Route("api/[controller]")]

    //Sluzi da mozemo preko http da pristupimo kontroleru
    [ApiController]
    public class GarageController : ControllerBase
    {
        //Podatke koje posajemo sa parking cuvaju se u context
        private readonly DataContext _context;

        public GarageController(DataContext context)
        {
            this._context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<Garage>>> GetAllGarage()
        {
            //await vraca listu objekta
            var data = await _context.Garages.ToListAsync();

            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Garage>> GetCar(int id)
        {
            var data = await _context.Garages.FindAsync(id);
            if (data == null)
                return NotFound("Car not found.");

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> AddCar([FromBody] Garage car)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    car.time = DateTime.Now;

                    //Nova kola dodaje na kraj _context sto je lista kola
                    await _context.Garages.AddAsync(car);
                    await _context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPut]
        public async Task<IActionResult> UpdateCar([FromBody] Garage updatedCar)
        {
 
                var existingCar = await _context.Garages.FindAsync(updatedCar.Id);

                if (existingCar == null)
                {
                    return NotFound("Car not found.");
                }

                // Ažurirajte željene podatke
                existingCar.brand = updatedCar.brand;
                existingCar.model = updatedCar.model;
                existingCar.license= updatedCar.license;
                existingCar.color = updatedCar.color;
                existingCar.placeID = updatedCar.placeID;

                // Dodajte ostale atribute koje želite ažurirati


                await _context.SaveChangesAsync();

                return Ok();

        }



        [HttpDelete]
        public async Task<IActionResult> RemoveCar([FromBody] Garage deletedCar)
        {
            var existingCar = await _context.Garages.FindAsync(deletedCar.Id);

            if (existingCar == null)
            {
                return NotFound("Car not found.");
            }
            _context.Garages.Remove(existingCar);
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}

