# How to start the app

Run ```npm i```
Run ```npm run start```

You will need to add a ```.env``` file inside of the sudokuru folder.<br>
The values needed for the ```.env``` file can be found in our shared password notebook kept in the secret location on campus in the MSB bathroom.<br>
Copy those values and paste them in the ```.env``` folder. The reason why we are doing this is so we don't store sensitive information publicly in code.<br>

For testing with a mobile device you can download the Expo app.<br>
You will also need to be logged in to Expo on the development device (laptop/desktop that is running the code)<br>
To login type: ```expo login``` and fill out the parameters.<br><br>

**Note: If you get the ```Callback URL mismatch``` error, do the following step:**<br>
For the app, each developer will have a different redirect endpoint. Log in to Auth0 and go to Applications. 
Go to Sudokuru and then go to Settings. In Application URI, in Application Login URI, you can set your URI by following the existing format and using your expo username.<br><br>
Contact Thomas to get added to the Expo organization so you can log in with your own email and password.<br><br>

For iOS, scan the QR code with your camera app, for Android you will need to scan the code from within the Expo app.<br><br>
For Web, hit the w key to start up the website at ```localhost:19006```

# Set up Local Backend Services

1. Install Docker on your machine. Tutorial is linked below:<br>
   [![Docker Tutorial](https://img.youtube.com/vi/2ezNqqaSjq8/0.jpg)](https://www.youtube.com/watch?v=2ezNqqaSjq8)<br>
2. Login to docker with the command ```docker login --username <GitHub_Username>```<br>
   You will be asked for your password, which is your GitHub Token. Make sure your GitHub Token has permissions to access GitHub's Container Registry!<br>
   The needed scope is ```read:packages```<br>
   This command should be run in the terminal in the root folder of this project (*NOT sudokuru*).<br>
3. Once docker is installed, the Mongo image can be run with this command in the root folder:<br>
   Note use ```sudo``` on Linux/Mac<br>
   ```docker-compose up -d```

# Deployments

### Preview Branch
In order to deploy your local branch in preview mode, run the following command:<br>
```npm run vercel:preview```<br>
You will need to log in with our team email account.<br>
The console will output a preview url for viewing.<br>

Preview mode can be run on any branch to preview how the site will look on Vercel.<br>
It is encouraged to use preview mode before merging changes into main.<br>

### Preview PR
PR Previews can be viewed from the bot comment at the bottom of the PR.<br>
PR Previews can also be viewed in the ```Publish Preview``` task of the ```app_preview``` job.<br>
The website link allows you to add comments directly to the webpage!<br>

## This Project uses React-Native-Web. This means we will share code for the app and the website and avoid duplicating our work. 
