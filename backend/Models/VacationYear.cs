namespace VacationPlusNewAPI.Models;

public class VacationYear
{
    public int Id { get; set; }
    public int Year { get; set; }
    public int DepartmentId { get; set; }
    public string UserIds { get; set; }
    public bool IsCurrent { get; set; }
    public bool IsReady { get; set; }
}