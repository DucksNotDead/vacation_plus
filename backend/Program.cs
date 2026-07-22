using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using VacationPlusNewAPI;
using VacationPlusNewAPI.Data;
using VacationPlusNewAPI.Models;

#region BUILDING
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>                                         
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
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});
builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
}); 
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("token", new OpenApiSecurityScheme // Adding authorization
    {
        Description = "JWT токен авторизации",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement() // Authorization in header
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "token"
                },
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
#endregion

#region UTILITES
async Task<User?> GetUserFromToken(HttpContext httpContext, DataContext dataContext)
{
    var handler = new JwtSecurityTokenHandler();
    var authHeader = httpContext.Request.Headers["Authorization"].ToString();

    string token = authHeader.Substring("Bearer ".Length);
    int UserId = int.Parse(handler.ReadJwtToken(token).Claims.First(c => c.Type == "UserId").Value);
    
    return await dataContext.Users.FirstOrDefaultAsync(u => u.Id == UserId);
}

async Task<List<User>> GetDepartmentUsers(DataContext context, int departmentId) => 
    (await context.Users.ToListAsync()).FindAll(u => u.DepartmentId == departmentId);

List<int> StringIdsToList(string idsString) => idsString
    .Split(",")
    .Select(str => str.Trim().Length > 0? int.Parse(str.Trim()) : -1)
    .ToList()
    .FindAll(id => id != -1);
#endregion

#region AUTHENTICATION
app.MapPost("/login", async (DataContext context, LoginEntity loginData) =>
{
    User? user = await context.Users.FirstOrDefaultAsync(u => (u.Mail == loginData.Mail));
    if (user == null)
        return Results.Unauthorized();

    Department? department = await context.Departments.FirstOrDefaultAsync(d => d.Id == user.DepartmentId);

    bool verify = Hashing.VerifyPassword(loginData.Password, user.Password, Convert.FromHexString(user.Salt));
    if (!verify)
        return Results.Unauthorized();

    var claims = new List<Claim>() { new Claim("UserId", user.Id.ToString()) };
    // Ещё можно добавить роль
    var jwt = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(AuthOptions.TokenLifeTime)),
        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

    var response = new
    {
        userdata = new
        {
            Id = user.Id,
            Mail = user.Mail,
            Phone = user.Phone,
            Fio = user.Fio,
            ShortFio = user.ShortFio,
            Organization = user.Organization,
            Access = user.Access,
            Control = user.Control,
            Department = department,
            Days = user.Days,
            Avatar = user.Avatar,
        },
        access_token = encodedJwt,
    };

    return Results.Json(response);
});

app.MapPost("/auth", [Authorize] async (HttpContext httpContext, DataContext dataContext) =>
{
    User? user = await GetUserFromToken(httpContext, dataContext);
    if (user is null)
        return Results.BadRequest();

    Department? department = await dataContext.Departments.FirstOrDefaultAsync(d => d.Id == user.DepartmentId);
    
    var response = new
    {
        userdata = new
        {
            Id = user.Id,
            Mail = user.Mail,
            Phone = user.Phone,
            Fio = user.Fio,
            ShortFio = user.ShortFio,
            Organization = user.Organization,
            Access = user.Access,
            Control = user.Control,
            Department = department,
            Days = user.Days,
            Avatar = user.Avatar,
        }
    };
    return Results.Json(response);
});
#endregion

#region GET
app.MapGet("/users/{departmentId}", [Authorize] async (DataContext context, int departmentId) =>
{
    return Results.Json((await GetDepartmentUsers(context, departmentId))
        .FindAll(u => u.Access == 0)
        .Select(u =>
        {
            return new ShortUser()
            {
                Id = u.Id,
                Fio = u.Fio,
                ShortFio = u.ShortFio,
                Avatar = u.Avatar
            };
        })
        .ToList()
        );
});

app.MapGet("/users/{departmentId}/{id}", [Authorize] async (DataContext context, int departmentId, int id) =>
{
    var user = await context.Users.FirstOrDefaultAsync(u => u.DepartmentId == departmentId && u.Id == id);
    if (user is null)
        return Results.BadRequest();

    var vacations = (await context.VacationIntervals.ToListAsync()).FindAll(v => v.UserId == id);

    var result = new
    {
        Id = id,
        Mail = user.Mail,
        Phone = user.Phone,
        Fio = user.Fio,
        ShortFio = user.ShortFio,
        Organization = user.Organization,
        Access = user.Access,
        Control = user.Control,
        DepartmentId = user.DepartmentId,
        Days = user.Days,
        Avatar = user.Avatar,
        
        vacations
    };
    return Results.Json(result);
});

app.MapGet("/users-vacations/{departmentId}", [Authorize] async (DataContext context, int departmentId) =>
{
    VacationYear? year =
        await context.VacationYears.FirstOrDefaultAsync(y => y.DepartmentId == departmentId && y.IsCurrent);
    List<VacationInterval> vacations = 
        await context.VacationIntervals.ToListAsync();
    return Results.Json((await GetDepartmentUsers(context, departmentId))
        .Select(u =>
        {
            return new 
            {
                Id = u.Id,
                Days = u.Days,
                CurrentVacations = vacations.FindAll(v => v.YearId == year?.Id && v.UserId == u.Id),
                LastVacationDate = vacations.LastOrDefault(v => v.UserId == u.Id)?.dateInterval.Split("-")[1]
            };
        })
        .ToList()
    );
});

app.MapGet("/units/{departmentId}", [Authorize] async (DataContext context, int departmentId) =>
{
    var units = (await context.Units.ToListAsync()).FindAll(u => u.DepartmentId == departmentId);
    
    return Results.Json(units);
});

app.MapGet("/vacations/{userId}", [Authorize] async (DataContext context, int userId) =>
{
    return Results.Json((await context.VacationIntervals.ToListAsync()).FindAll(v => v.UserId == userId));
});

app.MapGet("/vacation-years/{departmentId}/", [Authorize] async (DataContext context, int departmentId) =>
{
    return Results.Json((await context.VacationYears.ToListAsync()).FindAll(y => y.DepartmentId == departmentId));
});

app.MapGet("/vacation-years/{departmentId}/{year}", [Authorize] async (DataContext context, int departmentId, int year) =>
{
    VacationYear? yearEntity = await context.VacationYears.FirstOrDefaultAsync(y => y.Year == year && y.DepartmentId == departmentId);
    if (yearEntity is null) 
        return Results.BadRequest();
    
    List<User> users = await GetDepartmentUsers(context, departmentId);
    List<VacationInterval> vacations = (await context.VacationIntervals.ToListAsync()).FindAll(v => v.YearId == yearEntity.Id);
    List<UserInVacationYear> usersInYear = new List<UserInVacationYear>();
    
    foreach (var userId in StringIdsToList(yearEntity.UserIds))
    {
        var user = users.FirstOrDefault(u => u.Id == userId);
        if (user is not null)
        {
            var userVacationsInYear = vacations.FindAll(v => v.UserId == userId);
            var userInYear = new UserInVacationYear()
            {
                Id = userId,
                IsReady = userVacationsInYear.Count > 0,
                ShortFio = user.ShortFio,
                Avatar = user.Avatar,
                Vacations = userVacationsInYear,
                Days = user.Days
            };
            usersInYear.Add(userInYear);
        }
    }

    var result = new
    {
        Id = yearEntity.Id,
        Year = yearEntity.Year,
        IsReady = yearEntity.IsReady,
        IsCurrent = yearEntity.IsCurrent,
        Users = usersInYear,
    };
    return Results.Json(result);
});

app.MapGet("/vacation-year-user-ready/{departmentId}/{userId}", [Authorize] async (DataContext context, int departmentId, int userId) =>
{
    VacationYear? year = 
        await context.VacationYears.FirstOrDefaultAsync(y => y.IsCurrent && y.DepartmentId == departmentId);
    if (year is null)
        return Results.BadRequest();

    VacationInterval? vacation =
        await context.VacationIntervals.FirstOrDefaultAsync(v => v.YearId == year.Id && v.UserId == userId);
    if (vacation is null && !year.IsReady)
        return Results.Json(new
        {
            YearId = year.Id,
            Status = false
        });

    return Results.Json(new
    {
        YearId = year.Id,
        Status = true
    });
});
#endregion

#region POST
app.MapPost("/create-unit", [Authorize] async (DataContext context, Unit entity) =>
{
    context.Units.Add(entity);
    await context.SaveChangesAsync();
    
    Unit newUnit = (await context.Units.ToListAsync()).Last();
    return Results.Json(newUnit);
});

app.MapPost("/create-vacation", [Authorize] async (DataContext context, VacationCreateEntity entity) =>
{
    User? user = await context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserId);
    if (user is null)
        return Results.BadRequest();

    user.Days -= entity.DaysCost;
    context.Users.Update(user);
    
    context.VacationIntervals.Add(new VacationInterval()
    {
        Id = entity.Id,
        UserId = entity.UserId,
        YearId = entity.YearId,
        dateInterval = entity.dateInterval
    });
    
    await context.SaveChangesAsync();

    var newVacation = (await context.VacationIntervals.ToListAsync()).Last();
    return Results.Json(newVacation);
});

app.MapPost("/create-vacation-year", [Authorize] async (DataContext context, VacationYearCreateEntity entity) =>
{
    List<VacationYear> years = (await context.VacationYears.ToListAsync()).FindAll(y => y.DepartmentId == entity.DepartmentId);
    List<User> users = await GetDepartmentUsers(context, entity.DepartmentId);

    string userIds = string.Join(",", users.Select(u => u.Id).ToArray());
    
    context.VacationYears.Add(new VacationYear()
    {
        DepartmentId = entity.DepartmentId,
        UserIds = userIds,
        Year = entity.Year,
        IsReady = false,
        IsCurrent = true
    });
    await context.SaveChangesAsync();

    VacationYear newYear = (await context.VacationYears.ToListAsync()).Last();
    
    await context.SaveChangesAsync();
    return Results.Json(newYear);
});
#endregion

#region DELETE
app.MapDelete("/delete-unit/{id}", [Authorize] async (DataContext context, int id) =>
{
    context.Units.Remove(await context.Units.FindAsync([id]));
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapDelete("/delete-vacation/{id}", [Authorize] async (DataContext context, int id) =>
{
    context.VacationIntervals.Remove(await context.VacationIntervals.FindAsync([id]));
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapDelete("/delete-vacation-year/{id}", [Authorize] async (DataContext context, int id) =>
{
    var year = await context.VacationYears.FindAsync([id]);
    if (year is null)
        return Results.BadRequest();
    
    var vacations = (await context.VacationIntervals.ToListAsync()).FindAll(v => v.YearId == year.Id);
    
    foreach (var vacation in vacations) context.VacationIntervals.Remove(vacation);
    
    context.VacationYears.Remove(year);
    
    await context.SaveChangesAsync();
    return Results.Ok();
});
#endregion

#region PUT
app.MapPut("/change-avatar", [Authorize] async (DataContext context, HttpContext httpContext, AvatarChangeEntity entity) =>
{
    User? user = await GetUserFromToken(httpContext, context);
    if (user is null)
        return Results.BadRequest();

    user.Avatar = entity.Data;
    
    context.Users.Update(user);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/set-days", [Authorize] async (DataContext context, HttpContext httpContext, DaysChangeEntity entity) =>
{
    User? user =
        await context.Users.FirstOrDefaultAsync(u => u.DepartmentId == entity.DepartmentId && u.Id == entity.UserId);
    if (user is null)
        return Results.BadRequest();

    user.Days = entity.Days;
    
    context.Users.Update(user);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/change-unit", [Authorize] async (DataContext context, Unit entity) =>
{
    context.Units.Update(entity);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/change-vacation", [Authorize] async (DataContext context, VacationInterval entity) =>
{
    context.VacationIntervals.Update(entity);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/change-vacation-year-users", [Authorize] async (DataContext context, VacationYearChangeUsersEntity entity) =>
{
    VacationYear? year = await context.VacationYears.FirstOrDefaultAsync(y => y.Id == entity.Id);
    if (year == null)
        return Results.BadRequest();

    year.UserIds = entity.UserIds;
    
    context.VacationYears.Update(year);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/open-vacation-year/{yearId}", [Authorize] async (DataContext context, int yearId) =>
{
    VacationYear? activeYear = await context.VacationYears.FirstOrDefaultAsync(y => y.IsCurrent);
    VacationYear? year = await context.VacationYears.FirstOrDefaultAsync(y => y.Id == yearId);
    
    if (year is null)
        return Results.BadRequest();

    if (activeYear is not null)
    {
        activeYear.IsCurrent = false;
        context.VacationYears.Update(activeYear);
    }
        

    if (year.IsCurrent)
        return Results.BadRequest();

    year.IsCurrent = true;

    context.VacationYears.Update(year);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/close-vacation-year/{yearId}", [Authorize] async (DataContext context, int yearId) =>
{
    VacationYear? year = await context.VacationYears.FirstOrDefaultAsync(y => y.Id == yearId);
    if (year == null)
        return Results.BadRequest();

    if (year.IsCurrent is false)
        return Results.BadRequest();

    year.IsCurrent = false;

    context.VacationYears.Update(year);
    await context.SaveChangesAsync();
    return Results.Ok();
});

app.MapPut("/set-vacation-year-ready/{yearId}", [Authorize] async (DataContext context, int yearId) =>
{
    VacationYear? year = await context.VacationYears.FirstOrDefaultAsync(y => y.Id == yearId);
    if (year == null)
        return Results.BadRequest();

    if (year.IsReady)
        return Results.BadRequest();

    year.IsReady = true;

    context.VacationYears.Update(year);
    await context.SaveChangesAsync();
    return Results.Ok();
});
#endregion

app.Run();

#region DataClasses
public class LoginEntity
{
    public string? Mail { get; set; }
    public string? Password { get; set; }
}

public class AuthOptions
{
    const string KEY = "supersecretkey00supersecretkey00"; // ключ для шифрации [по идее его надо хранить в другом месте]
    public const int TokenLifeTime = 7 * 24 * 60; // 1 week
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

public class AvatarChangeEntity
{
    public string Data { get; set; }
}

public class DaysChangeEntity
{
    public int Days { get; set; }
    public int DepartmentId { get; set; }
    public int UserId { get; set; }
}

public class VacationCreateEntity : VacationInterval
{
    public int DaysCost { get; set; }
}

public class VacationYearCreateEntity
{
    public int DepartmentId { get; set; }
    public int Year { get; set; }
}

public class VacationYearChangeUsersEntity
{
    public int Id { get; set; }
    public string UserIds { get; set; }
}

public class UserInVacationYear
{
    public int Id { get; set; }
    public bool IsReady { get; set; }
    public string ShortFio { get; set; }
    public string Avatar { get; set; }
    public List<VacationInterval> Vacations { get; set; }
    public int Days { get; set; }
}
#endregion