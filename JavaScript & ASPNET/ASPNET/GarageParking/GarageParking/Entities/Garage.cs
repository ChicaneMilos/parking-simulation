namespace GarageParking.Entities
{

    public class Garage
    {
        public int Id { get; set; }
        public string brand { get; set; } = string.Empty;
        public string model { get; set; } = string.Empty;
        public string license { get; set; } = string.Empty;
        public string color { get; set; } = string.Empty;
        public int placeID { get; set; } = 0;
        public DateTime time { get; set; } = DateTime.Today;
    }
}
