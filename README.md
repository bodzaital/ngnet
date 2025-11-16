# ngnet
Angular/ASP.NET Core template.

## Setup

### 1. Generate code

To replicate this repo, generate your backend and your frontend:

```sh
mkdir <AppName> && cd <AppName>
dotnet new webapi --use-controllers
mkdir wwwroot
ng new Frontend --style css --ssr false --zoneless false --ai-config none
```

Change `<AppName>` to the actual name of your application. Feel free to change the options for the .NET and Angular generators.

The backend is in the AppName folder, the frontend is in the AppName/Frontend folder. *If you want to place the frontend in a different folder, be mindful of the relative outputPath.base property in step 3.*

### 3. Add .gitignore

Add a `.gitignore` file as needed. In this repo, these contents are used:

```.gitignore
# macOS specific desktop files.
**/.DS_Store

# .NET binary folders.
**/bin
**/obj

# Angular/Node folders.
**/.angular
**/node_modules

# Build target of Angular.
**/wwwroot/*

# DB and temp DB files.
**/*.db
**/*.db-shm
**/*.db-wal
```

### 3. Modify Angular build path

Modify `angular.json` to build the frontend package into the `wwwroot` folder. Add these configurations to the beginning of `projects.Frontend.architect.build.options`:

```json
"outputPath": {
	"base": "../wwwroot",
	"browser": ""
},
"index": "src/index.html",
```

The next line should be `"index": "src/index.html"` and the rest of the configuration (but it can be placed anywhere within the build options block).

### 4. Serve Angular from .NET

Change `Program.cs` to allow requests and serve the build frontend package:

```cs
// Add CORS to the services. Do not forget to set the necessary policy.
builder.Services.AddCors((options) =>
{
    options.AddDefaultPolicy((policy) => policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});

// WebApplication: (uncommented lines are the additions)

// app.UseHttpsRedirection();
app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();
// app.UseAuthorization();
// app.MapControllers();
app.MapFallbackToFile("index.html");
```

If you want to use credentials, add `.AllowCredentials()` to the CORS policy and set specific origins instead of `.AllowAnyOrigin()`.

## Local development

To run the app locally, start the frontend:

```sh
cd Frontend
npm run start
```

And in a separate process start the backend:

```sh
dotnet run
```

## Deploy

To serve the frontend from the .NET backend directly, first build the frontend:

```sh
cd Frontend
npm run build
```

Then publish the backend to create a single hostable application with the frontend and the backend together:

```sh
dotnet publish --runtime <RID>
```

The `<RID>` should be your target runtime identifier, like `osx-arm64`, `linux-x64`, or `win-x86`.  
See also: https://learn.microsoft.com/en-us/dotnet/core/rid-catalog
