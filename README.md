# CS348 Project: LuxeCar

## Milestone 1

### Project Overview

Our application aims to provide users with an intuitive platform to discover and explore luxury cars for purchase or general interest. The primary users of the application are individuals interested in purchasing, Browse, or learning more about luxury cars. Developers will serve as administrators of the database system.

The core data for our application is derived from a sports car dataset on Kaggle (link: https://www.kaggle.com/datasets/rkiattisak/sports-car-prices-dataset/data). This dataset includes vital information about cars such as:
* **Make:** The brand or company that produced the car.
* **Model:** The specific version or variant of the car.
* **Year:** The year of production.
* **Engine Size (in L):** The displacement of the engine.
* **Horsepower:** Engine power output.
* **Torque (lb-ft):** Rotational force produced by the engine.
* **Acceleration (0-60 MPH time in seconds):** How quickly the car reaches 60 MPH.
* **Price (in USD):** The cost of the car.

### Core Functionalities (Planned)

The application is designed to support a range of functionalities:
* **Search & Filtering:** Users can search for cars by make or model, and filter by attributes like year, engine size, horsepower, torque, acceleration, and price (range-based filters).
* **Personalization:** Users can save liked cars, create custom folders, and save cars into these folders.
* **User Accounts:** Account creation, sign-in, and the ability to leave reviews/comments on cars.
* **Recommender System:** Potential recommendation features based on user likes and preferences.
* **Currency Conversion:** A fancy feature to adjust car prices based on the user's location.
* **Authorization:** Exploration of different access roles and privileges for regular users and administrators.
* **Analytical Features:** Aggregating and displaying analytical information about cars in folders (e.g., average price of a folder).
* **Automated Folders:** Automatically creating a "Liked" folder for every user.

### Tech Stack

Our project is built using the following technologies:
* **Database:** MySQL, hosted with Docker.
* **Frontend:** React + Next.js web application.
* **Backend:** Node.js.

### Setup and Running the Application

Follow these steps to get the project up and running on your local machine:

**1. Clone the Repository:**
   ```bash
   git clone [https://github.com/Laav7575/CS348Project.git](https://github.com/Laav7575/CS348Project.git)
   cd CS348Project

   