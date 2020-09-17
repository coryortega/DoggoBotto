# DoggoBotto
Hello! For those that don't know, DoggoBotto is a Twitter bot that posts both user submitted dog photos and non-user submitted dog photos. The simple goal of DoggoBotto is to make it's followers smile every day!

You can find the twitter page [**HERE**](https://twitter.com/doggos4all) and the official website [**HERE**](https://doggobotto.com/).

DoggoBotto also has a FE and BE repository:
- [**Front-End**](https://github.com/coryortega/DoggoBottoFE)
- [**Back-End**](https://github.com/coryortega/DoggoBottoBE)

## Setup
To get this bot up and running, it's quite simple.
- **Clone** this repository
- Run **npm install** to install all necessary dependencies
- Create an **.env** that holds your Twitter consumer and access keys
- Run **npm start**. It should default to localhost:5000

## Technologies Used
- **Express** is the Node framework used
- **Twit** is the Twitter API Client for Node, read more [here](https://www.npmjs.com/package/twit)
- I used Cron-Job's to schedule the execution of certain scripts, read more [here](https://cron-job.org/en/)
- [TheDogsAPI](https://thedogapi.com/) used for fetching non-user submitted dog photos
- Public quote API that can be found [here](https://type.fit/api/quotes)

## Routes
|     Description           |Route                         |    Method                     |
|----------------|-------------------------------|-----------------------------|
|Post non-user submitted Photos|`/post`            |**GET**           |
|Post user submitted photos (if they exist)         |`/doggoOTD`            |**GET**            |
|Search and follow users        |`/search`|**GET**|

### How are the routes used?
Each route is tied to a function that will execute when their endpoint is hit. For example, if I wanted DoggoBotto to post a picture of one random dog right now, I would perform a **GET** on the '/post' endpoint. I set each of these endpoints to be hit at specified times using Cron-Job's. For more information on Cron-Job's, visit [here](https://cron-job.org/en/).

## Diagram of how DoggoBotto works!
A flowchart that gives you a rough **rough** idea:

![doggobotto diagram](/images/DoggoBotto-diagram.PNG "Diagram")
