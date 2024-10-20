using Microsoft.EntityFrameworkCore;
using WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Configura el contexto de la base de datos
builder.Services.AddDbContext<DBModel>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Asegúrate de tener tu cadena de conexión configurada en appsettings.json

// Agrega el servicio de CORS
builder.Services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
{
    builder.AllowAnyOrigin()  // Permite cualquier origen
           .AllowAnyMethod()  // Permite cualquier método (GET, POST, etc.)
           .AllowAnyHeader(); // Permite cualquier encabezado
}));

// Agrega los controladores
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // This will preserve the property name casing
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Configura Swagger si lo necesitas
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configura el pipeline de la aplicación
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilita CORS
app.UseCors("MyPolicy"); // Asegúrate de colocar esto antes de cualquier middleware que maneje solicitudes

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
