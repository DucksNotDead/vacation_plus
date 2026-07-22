namespace VacationPlusNewAPI.Models;

public class ShortUser
{
    public int Id { get; set; }
    public string Avatar { get; set; }
    public string Fio { get; set; }
    public string ShortFio { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string Mail { get; set; }
    public string Phone { get; set; }
    public string Fio { get; set; }
    public string ShortFio { get; set; }
    public string Organization { get; set; }
    public int Access { get; set; }
    public string Control { get; set; }
    public int DepartmentId { get; set; }
    public int Days { get; set; }
    public string Avatar { get; set; }
    public string Salt { get; set; }
    public string Password { get; set; }
}