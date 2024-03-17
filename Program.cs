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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    // ���������� �������� ��������������
    .AddJwtBearer(options =>                                                // ����������� �������������� � ������� jwt-�������
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,                  // ���������, ����� �� �������������� �������� ��� ��������� ������
            //ValidIssuer = AuthOptions.ISSUER,       // ������, �������������� ��������
            ValidateAudience = false,                // ����� �� �������������� ����������� ������
            //ValidAudience = AuthOptions.AUDIENCE,   // ��������� ����������� ������
            ValidateLifetime = true,                // ����� �� �������������� ����� �������������
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(), // ��������� ����� ������������
            ValidateIssuerSigningKey = true,        // ��������� ����� ������������
        };
    });                            
builder.Services.AddAuthorization(); // ���������� �������� �����������

var app = builder.Build();

// ��� ������
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", (User loginData) =>
{
    User? user = Users.FirstOrDefault(u => (u.Name == loginData.Name && u.Password == loginData.Password));
    if (user == null)
        return Results.Unauthorized();

    //var claims = new List<Claim> { new Claim("UserName", loginData.Name) }; // ���� ���� ������ � �����
    var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            //claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)), // ����� �������� 2 ������
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    var response = new
    {
        access_token = encodedJwt,
        username = user.Name
    };

    return Results.Json(response);
});

app.Map("/data", [Authorize] () => new { message = "Hello World!" }); // ������ ��� ��������������� ������������

app.Run();

// ����� ����������
public class AuthOptions
{
    public const string ISSUER = "MyAuthServer";    // �������� ������
    public const string AUDIENCE = "MyAuthClient";  // ����������� ������
    const string KEY = "supersecretkey00supersecretkey00"; // ���� ��� �������� [�� ���� ��� ���� ������� � ������ �����]
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

// ���������
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