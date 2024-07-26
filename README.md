# Parking Simulation Project
The Parking Simulation project is a comprehensive application developed entirely using JavaScript, with backend support implemented twice using different technologies: Python and .NET (ASP.NET). The application simulates a parking environment where users can manage vehicle data within parking spots, tracking various attributes and calculating parking fees based on duration.

![Project Overview](https://drive.google.com/uc?id=12y6eBb2RzRrMHi6Fjk2tXiDSLADIx4Tw)



## Table of Contents

- [Features](#features)
- [Backend Technologies](#backend-technologies)
  - [JavaScript with Python (MySQL)](#javascript-with-python-mysql)
  - [JavaScript with .NET (ASP.NET, SQL Server)](#javascript-with-net-aspnet-sql-server)
- [Installation](#installation)
  - [JavaScript with Python](#javascript-with-python)
  - [JavaScript with .NET](#javascript-with-net)
- [Contact](#contact)
- [Gallery](#gallery)



## Features
+ **Vehicle Data Management** - Users can input and manage details of vehicles including color, brand, model, and registration number. </br>
+ **Parking Duration Tracking** - The application tracks the total time each vehicle remains parked. </br>
+ **CRUD Operations** - Users can add, update, and delete vehicle entries. </br>
+ **Parking Fee Calculation** - The first 3 hours of parking are free. Beyond that, the application calculates the total parking fee based on the number of hours parked and the hourly rate. </br>
+ **Parking System** - The application includes a parking system that manages check-ins and check-outs of vehicles. </br>
+ **Multi-Level Parking** - Users can park vehicles on different levels of the garage. It is also possible to add or remove levels within the garage as needed. </br>
+ **User Registration and Login** - Users can register and log in to the application. </br>
+ **Role-Based Access Control**:
  + **Guest** - Can view parked vehicles.
  + **User** - Can add and manipulate their own vehicles.
  + **Admin** - Can manipulate any vehicle and manage garage levels. </br>
## Backend Technologies
### JavaScript with Python (MySQL)
+ **Database Communication** - Uses Python to communicate with a MySQL database. </br>
+ **Data Handling** - Python scripts handle backend processes, ensuring smooth interaction with the database for storing and retrieving vehicle data. </br>
### JavaScript with .NET (ASP.NET, SQL Server)
+ **Database Communication** - Utilizes ASP.NET with a SQL Server database specifically designed for this application. </br>
+ **Web Application Framework** - Provides a robust framework for managing backend operations and seamless interaction with the frontend. </br>
+ **Technology Stack** - Developed using .NET, ASP.NET, and C# to ensure high performance and reliability.



## Installation
To install and run this project locally, follow these steps:



### Prerequisites

- **Visual Studio Code & Live Server Extension**

**JavaScript with Python:**
- **Python 3.11** (recommended version)
- **MySQL Server**
- **MySQL Workbench or phpMyAdmin**

**JavaScript with .NET:**
- **.NET 8.0 SDK**
- **MS SQL Server**
- **SQL Server Management Studio (SSMS)**
- **Visual Studio 2022** (or any version that supports .NET 8.0)


### JavaScript with Python

1. **Clone the repository from GitHub:**
   ```bash
   git clone https://github.com/ChicaneMilos/parking-simulation.git

2. **Import the database:**
    + Open MySQL Workbench or phpMyAdmin.
    + Create a new database.
    + Import the garaza.sql file located in the repository into the new database.
  
3. **Run the Python server:**
    + Navigate to the directory containing Python code and start the server:
      ```bash
      python app.py

4. **Run the web app:**
    + Open Visual Studio Code.
    + Open the JavaScript folder located in the repository.
    + Start live server.
  
### JavaScript with .NET

1. **Clone the repository from GitHub:**
   ```bash
   git clone https://github.com/ChicaneMilos/parking-simulation.git

2. **Import the database:**
    + Open SQL Server Management Studio (SSMS).
    + Connect to your SQL Server instance.
    + Right-click on the Databases node and select **Restore Database...**
    + Select the **Device** option and choose the backup file (**`garaza.bak`**) located in the repository.
    + Follow the prompts to restore the database.
  
3. **Run the .NET server:**
    + Open Visual Studio 2022.
    + Open the solution file (**`.sln`**) located in the repository.
    + Ensure the database connection string in **`appsettings.json`** is correctly configured to point to your SQL Server instance.
    + Build and run the project.
  
4. **Run the web app:**
    + Open Visual Studio Code.
    + Open the JavaScript folder located in the repository.
    + Start Live Server.

## Contact

If you have any questions, feedback, or inquiries, please feel free to reach out to me at:

- **Email:** [jokic.milos@outlook.com](mailto:jokic.milos@outlook.com)

## Gallery
![Vehicle Status](https://drive.google.com/uc?id=1v7W-iDZu4vC_BKVlbl3o9B1X_3U3in6B)
![Edit Vehicle](https://drive.google.com/uc?id=13LvlST6k6mWLp9kucCc2v4aWSXILmu7C)
![Vehicle Unparked](https://drive.google.com/uc?id=1JIfDrTvxLo-qQ_LJJj7rbFT-Lee0mRAP)
![Garage Manager](https://drive.google.com/uc?id=16H1DMTfmBe5__0JVdRFXGY_mLVDLV-3n)
![Login Screen](https://drive.google.com/uc?id=1kLGxRLKh2MMxUA2OrGCZIu4e13bh42yf)
![Register Screen](https://drive.google.com/uc?id=1VbboXovHA3mnEyu4OpU_lYjRWN3uUnOe)
![Add Vehicle](https://drive.google.com/uc?id=16mzAabVac-9OMDpREGJ2n0p4SpJwIm_E)

