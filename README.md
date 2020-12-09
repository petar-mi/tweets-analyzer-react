# tweets-analyzer

Renders tweets that are first classified using natural language processing in 3D in the browser. 

This is the frontend part of the app, written in ReactJS, and also uses javascript [Three.js](https://github.com/mrdoob/three.js/) library to create and display animated 3D computer graphics in a web browser.

How it works:</br>
The app prompts for a twitter username. The only limitation is that the user's tweets are in English, for tweets analysis tools to work correctly. Tweeter username is then sent to the backend, which activates [puppeteer](https://pptr.dev/), web scraping library that runs a headless Chromium browser on a remote server and imitates user browsing to visit the user's twitter account and make a collection of unique tweets. It then uses remote [MeaningCloud](https://www.meaningcloud.com/) (SaaS product that enables text semantic processing) API, to classify the tweets based on their text content. Simultaneously, tweets are analysed in the app itself using [Natural](https://github.com/NaturalNode/natural) javascript library. If MeaningCloud fails to classify some of the tweets, then this internal classification performed by Natural is used instead.</br>
Classified tweets are then sent to the frontend to be rendered in 3D using [Three.js](https://github.com/mrdoob/three.js/). By clicking on any category, a list of the tweets shows up and if user considers the classification was not done right for any of the tweets, this can be adjusted manually by selecting a more appropriate category from the drop-down menu, which immediately re-renders the page. After all tweets were rendered and possibly classification manualy adjusted, "Send all back to server" option appears, which, if clicked, will send all the tweets and classifications to backend for Natural classifier training data to be updated and trained so to be ready when another analysis is issued. Also, classified tweets will be stored in a Mongo database and can be included in future tweets classifications.

The app has been deployed to Heroku and is available here: [tweets-analyzer](https://tweets-analyzer-react.herokuapp.com/). </br>

Locally, you can run it by navigating to the project directory:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

For the app to work locally, a separate backend [app](https://github.com/m-petar/my-express-server) is required to run as well.
