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
user.Fio = "Фамилия1 Имя1 Отчество1";
user.ShortFio = "Фамилия1 И.О.";
user.Oranization = "Организация1";
user.JobTitle = "Разработчик";
user.Control = "Контроль разработчика";
user.DepartmentId = 1;
user.Days = 61;
user.DaysOff = 4;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 2;
user.Mail = "usertest@gmail.com";
user.Number = 2;
user.Fio = "Фамилия2 Имя2 Отчество2";
user.ShortFio = "Фамилия2 И.О.";
user.Oranization = "Организация1";
user.JobTitle = "Дизайнер";
user.Control = "Контроль дизайнера";
user.DepartmentId = 2;
user.Days = 240;
user.DaysOff = 20;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 3;
user.Mail = "ttteeesssttt@yandex.ru";
user.Number = 3;
user.Fio = "Фамилия3 Имя3 Отчество3";
user.ShortFio = "Фамилия3 И.О.";
user.Oranization = "Организация2";
user.JobTitle = "Разработчик";
user.Control = "Контроль разработчика";
user.DepartmentId = 3;
user.Days = 10;
user.DaysOff = 0;
user.Password = "123";
Users.Add(user);

user = new User();
user.Id = 4;
user.Mail = "mblksmbkl@mail.ru";
user.Number = 4;
user.Fio = "Фамилия31 Имя42 Отчество53";
user.ShortFio = "Фамилия31 И.О.";
user.Oranization = "Организация1";
user.JobTitle = "Разработчик";
user.Control = "Контроль разработчика";
user.DepartmentId = 1;
user.Days = 628;
user.DaysOff = 44;
Users.Add(user);


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    // добавление сервисов аутентификации
    .AddJwtBearer(options =>                                                // подключение аутентификации с помощью jwt-токенов
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,                  // указывает, будет ли валидироваться издатель при валидации токена
            ValidateAudience = false,                // будет ли валидироваться потребитель токена
            ValidateLifetime = true,                // будет ли валидироваться время существования
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(), // установка ключа безопасности
            ValidateIssuerSigningKey = true,        // валидация ключа безопасности
        };
    });   

builder.Services.AddAuthorization(); // добавление сервисов авторизации

var app = builder.Build();

// Для фронта
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

// Можно избавиться
public class AuthOptions
{
    const string KEY = "supersecretkey00supersecretkey00"; // ключ для шифрации [по идее его надо хранить в другом месте]
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