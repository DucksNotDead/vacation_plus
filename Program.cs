using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

List<User> Users = new List<User>() { new User("user1", "123"), new User("user2", "1234") };

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    // добавление сервисов аутентификации
    .AddJwtBearer(options =>                                                // подключение аутентификации с помощью jwt-токенов
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,                  // указывает, будет ли валидироватьс€ издатель при валидации токена
            //ValidIssuer = AuthOptions.ISSUER,       // строка, представл€юща€ издател€
            ValidateAudience = false,                // будет ли валидироватьс€ потребитель токена
            //ValidAudience = AuthOptions.AUDIENCE,   // установка потребител€ токена
            ValidateLifetime = true,                // будет ли валидироватьс€ врем€ существовани€
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(), // установка ключа безопасности
            ValidateIssuerSigningKey = true,        // валидаци€ ключа безопасности
        };
    });                            
builder.Services.AddAuthorization(); // добавление сервисов авторизации

var app = builder.Build();

// ƒл€ фронта
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", (User loginData) =>
{
    User? user = Users.FirstOrDefault(u => (u.Name == loginData.Name && u.Password == loginData.Password));
    if (user == null)
        return Results.Unauthorized();

    //var claims = new List<Claim> { new Claim("UserName", loginData.Name) }; // ≈сли надо данные в токен
    var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            //claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)), // врем€ действи€ 2 минуты
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    var response = new
    {
        access_token = encodedJwt,
        username = user.Name
    };

    return Results.Json(response);
});

app.Map("/data", [Authorize] () => new { message = "Hello World!" }); // “олько дл€ авторизованного пользовател€

app.Run();

// ћожно избавитьс€
public class AuthOptions
{
    public const string ISSUER = "MyAuthServer";    // издатель токена
    public const string AUDIENCE = "MyAuthClient";  // потребитель токена
    const string KEY = "supersecretkey00supersecretkey00"; // ключ дл€ шифрации [по идее его надо хранить в другом месте]
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

// –асширить
public class User
{
    public string Name { get; set; }
    public string Password { get; set; }

    public User(string name, string password)
    {
        Name = name;
        Password = password;
    }
}