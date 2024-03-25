using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

List<User> Users = new List<User>();

// ----- Test data -----
Users = new List<User>();
User user = new User();
user.Id = 1;
user.Mail = "testuser@gmail.com";
user.Number = 1;
user.Fio = "�������1 ���1 ��������1";
user.ShortFio = "�������1 �.�.";
user.Oranization = "�����������1";
user.JobTitle = "�����������";
user.Control = "�������� ������������";
user.DepartmentId = 1;
user.Days = 61;
user.DaysOff = 4;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 2;
user.Mail = "usertest@gmail.com";
user.Number = 2;
user.Fio = "�������2 ���2 ��������2";
user.ShortFio = "�������2 �.�.";
user.Oranization = "�����������1";
user.JobTitle = "��������";
user.Control = "�������� ���������";
user.DepartmentId = 2;
user.Days = 240;
user.DaysOff = 20;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 3;
user.Mail = "ttteeesssttt@yandex.ru";
user.Number = 3;
user.Fio = "�������3 ���3 ��������3";
user.ShortFio = "�������3 �.�.";
user.Oranization = "�����������2";
user.JobTitle = "�����������";
user.Control = "�������� ������������";
user.DepartmentId = 3;
user.Days = 10;
user.DaysOff = 0;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 4;
user.Mail = "mblksmbkl@mail.ru";
user.Number = 4;
user.Fio = "�������31 ���42 ��������53";
user.ShortFio = "�������31 �.�.";
user.Oranization = "�����������1";
user.JobTitle = "�����������";
user.Control = "�������� ������������";
user.DepartmentId = 1;
user.Days = 628;
user.DaysOff = 44;
Users.Add(user);


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    // ���������� �������� ��������������
    .AddJwtBearer(options =>                                                // ����������� �������������� � ������� jwt-�������
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,                  // ���������, ����� �� �������������� �������� ��� ��������� ������
            ValidateAudience = false,                // ����� �� �������������� ����������� ������
            ValidateLifetime = true,                // ����� �� �������������� ����� �������������
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(), // ��������� ����� ������������
            ValidateIssuerSigningKey = true,        // ��������� ����� ������������
        };
    });   

builder.Services.AddAuthorization(); // ���������� �������� �����������

var app = builder.Build();

// ��� ������
// app.UseDefaultFiles();
// app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", (LoginData loginData) =>
{
    User? user = Users.FirstOrDefault(u => (u.Mail == loginData.Mail && u.Password == loginData.Password));
    if (user == null)
        return Results.Unauthorized();

    var claims = new List<Claim>() { new Claim("UserId", user.Id.ToString()) };
    var jwt = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(AuthOptions.TokenLifeTime)),
        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    var response = new
    {
        userdata = (UserData)user,
        access_token = encodedJwt,
    };

    return Results.Json(response);
});

app.MapPost("/auth", (string encodedJwt) =>
{
    var handler = new JwtSecurityTokenHandler();
    int UserId = int.Parse(handler.ReadJwtToken(encodedJwt).Claims.First(c => c.Type == "UserId").Value);

    User? user = Users.FirstOrDefault(u => u.Id == UserId);
    var response = new
    {
        userdata = (UserData?)user
    };

    return Results.Json(response);
});

app.Run();

// ����� ����������
public class AuthOptions
{
    const string KEY = "supersecretkey00supersecretkey00"; // ���� ��� �������� [�� ���� ��� ���� ������� � ������ �����]
    public const int TokenLifeTime = 5;
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

public class UserData
{
    public int Id { get; set; }
    public string Mail { get; set; }
    public int Number { get; set; }
    public string Fio { get; set; }
    public string ShortFio { get; set; }
    public string Oranization { get; set; }
    public string JobTitle { get; set; }
    public string Control { get; set; }
    public int DepartmentId { get; set; }
    public int Days { get; set; }
    public int DaysOff { get; set; }
}
public class User : UserData
{
    public string Password { get; set; }
}

public class LoginData
{
    public string Mail { get; set; }
    public string Password { get; set; }
}