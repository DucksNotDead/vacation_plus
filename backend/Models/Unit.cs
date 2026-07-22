namespace VacationPlusNewAPI.Models;

public class FullUnit
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
    public List<ShortUser> Users { get; set; }
}
public class Unit
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string UserIds { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
}