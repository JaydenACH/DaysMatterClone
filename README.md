# Days Matter 😘

## Requirements
1. If you want to run this on your own, you need to setup the MongoDB account. Put in the URL for the database in the .env file. URL: "./backend/app/.env"
> MONGO_LINK = "mongodb+srv://{username}:{password}@daysmatter.gzrfyzd.mongodb.net/"

2. Setup a python virtual environment on the root directory
> python -m venv venv

3. Install the requirements via the requirements.txt file.
> pip install -r requirements.txt

## To Run
#### There are 2 ways to run the web application. 
1. To run the docker container, using docker-compose up from the root directory. (Make sure you have docker installed and running at the background.)
    > docker-compose up
2. Run the frontend & backend application separately.
    * In ./frontend/daysmatter
        > npm start
    * In ./backend/app
        > uvicorn app:app --reload

## To use the application
1. This application is for you to know how long has it been to happen something.
2. For example:
    * Started shampoo on 3 May 2024. If the on-going checkbox is ticked, the end date can be left blank. The application will calculate how many days has it been until today.
    * Once the event is ended, you can mark "on-going" as unchecked, and provide the end date.
    * The application will calculate the difference between 2 dates, in different measurements, i.e.: years / months / weeks / days.
    * The list will be sorted from the newest to oldest events, with the pinned one on top, and ended one at the most bottom.
3. From there, you can:
    * Edit the event's name
    * Pin any event on top, but you can only pin 1 event on top.
    * Delete any event. __(Warning ⚠️: there is no turning back other than recreate the deleted item)__
    * Toggle between list view or block view
    * Toggle between multiple format of the date difference.
        * Start: 2023-1-1; End: 2024-1-4
        * You can choose to view:⚠️
            * 1 year, 3 days
            * 12 months, 3 days
            * 48 weeks, 3 days
            * 368 days
    