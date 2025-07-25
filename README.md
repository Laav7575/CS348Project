# CS348 Project: LuxeGarage
## Milestone 3
### Implemented Features
1. indexes, trending, reviews, auto-generated production dataset, Admin Manage Cars, Stats/Aggregated Info, Authorization – Admin vs. Regular Users

**1 . Indexes**

**2. T**

---
## Milestone 2
### Implemented Functionalities
**1. User Authentication**  
Users can sign in to personalize their experience. Once logged in, they can save specific cars to folders for easy access later.  
> To test the login functionality, please use one of the emails and passwords provided in the Sample Dataset.

**2. Search & Filter**  
While browsing cars, users can easily navigate cars by searching by the make and model or by filtering results by: Price, Year, Engine size, Horsepower, Torque, and Acceleration.

**3. Folders**  
This feature requires the user to be logged in. After logging in, navigate to the Car **Explore** page, click on a specific car, and add it to your **Liked** folder or any custom folder you’ve created.

**4. Full Production Dataset**  
To update the entire production dataset in the database (this has already been done for our project):
1. Download the Sports Car CSV file from Kaggle: https://www.kaggle.com/datasets/rkiattisak/sports-car-prices-dataset/data
3. Upload the **Sports Car** CSV file from Kaggle to the `mysql-init` folder in the project root directory.  
   Rename the file to `fullsports.csv`.
4. To perform a one-time data clean, we use Pandas and python to normalize the data and put the cleaned CSV into the project root folder by running the following commands:

   ```bash
   pip install -r requirements.txt
   cd mysql-init
   python ./clean_data.py
5. Finally, the docker-compose.yml file loads the data into the MySQL database by running loaddata.js upon a new Docker container. The loaddata.js file connects to our MySQL database then runs the INSERT INTO Cars command for every row of the dataset.
---
## Milestone 1
Our application aims to provide users with an intuitive platform to discover and explore luxury cars for purchase or general interest. The primary users of the application are individuals interested in purchasing, browsing, or learning more about luxury cars. Developers will serve as administrators of the database system.

The core data for our application is derived from a sports car dataset on Kaggle (link: https://www.kaggle.com/datasets/rkiattisak/sports-car-prices-dataset/data). This dataset includes vital information about cars such as:
* **Make:** The brand or company that produced the car.
* **Model:** The specific version or variant of the car.
* **Year:** The year of production.
* **Engine Size (in L):** The displacement of the engine.
* **Horsepower:** Engine power output.
* **Torque (lb-ft):** Rotational force produced by the engine.
* **Acceleration (0-60 MPH time in seconds):** How quickly the car reaches 60 MPH.
* **Price (in USD):** The cost of the car.

### Implemented Functionality
* **Search:** Users can search for cars by make or model.

### Planned Functionalities
The application is planned to support a range of functionalities:
* **Personalization:** Users can save liked cars, create custom folders, and save cars into these folders.
* **User Accounts:** Account creation, sign-in, and the ability to leave reviews/comments on cars.
* **Recommender System:** Potential recommendation features based on user likes and preferences.
* **Authorization:** Exploration of different access roles and privileges for regular users and administrators.

### Tech Stack
Our project is built using the following technologies:
* **Database:** MySQL, hosted with Docker.
* **Frontend:** React + Next.js web application.
* **Backend:** Node.js.

### Setup and Running the Application <br>
Follow these steps to get the project up and running on your local machine:

**1. Clone the Repository:** <br>
   `git clone https://github.com/Laav7575/CS348Project.git`<br>
   `cd CS348Project`

**2. Install Frontend Dependencies** <br>
   `npm install`

**3. Add the .env.local file into the root of your project** <br>
The file contains the credentials required to login to the MySQL database.

**3. Prepare Database (Initial Setup / Reset)** <br>
Download Docker, open Docker, login and run: <br>
   `docker-compose down -v`<br>
   `docker-compose up -d mysql`

**4. Start Frontend** <br>
`npm run dev`

**5. Access the Application** <br>
Main Page: http://localhost:3000<br>
Search Cars Page: http://localhost:3000/explore   
