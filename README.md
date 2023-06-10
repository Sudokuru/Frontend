# How to start the frontend app

Run `npm i` in the root folder  
Run `npm i` in the sudokuru folder  
Run `npm run start`

You will need to add a `.env` file inside the sudokuru folder.  
Dummy values will be stored in `.env.template` file for reference.  
The values needed for the `.env` file can be found in our shared password notebook kept in the secret location on campus in the MSB bathroom.  
Copy those values and paste them in the `.env` folder. The reason why we are doing this is so that we don't store sensitive information publicly in code.

For testing with a mobile device you can download the Expo app.  
You will also need to be logged in to Expo on the development device (laptop/desktop that is running the code).  
To login type: `expo login` and fill out the parameters.

<br>

**Note: If you get the `Callback URL mismatch` error, do the following step:**  
For the app, each developer will have a different redirect endpoint. Log in to Auth0 and go to Applications.  
Go to Sudokuru and then go to Settings. In Application URI, in Application Login URI, you can set your URI by following the existing format and using your expo username.

Contact Thomas to get added to the Expo organization so that you can log in with your own email and password.

For iOS, scan the QR code with your camera app, for Android you will need to scan the code from within the Expo app.

For Web, hit the w key to start up the website at `localhost:19000`

# Set up Local Backend Services

1. Install Docker on your machine. Tutorial is linked below:  
   [![Docker Tutorial](https://img.youtube.com/vi/2ezNqqaSjq8/0.jpg)](https://www.youtube.com/watch?v=2ezNqqaSjq8)
2. Login to docker with the command `docker login --username ghcr.io <GitHub_Username>`  
   You will be asked for your password, which is your GitHub Token. Make sure your GitHub Token has permissions to access GitHub's Container Registry!  
   The needed scope is `read:packages`  
   This command should be run in the terminal in the root folder of this project (_NOT sudokuru_).
3. Once docker is installed, the Mongo image can be run with this command in the root folder:  
   Note use `sudo` on Linux/Mac  
   `npm run docker:start`
4. Postman calls and documentation is [available here](https://documenter.getpostman.com/view/23651156/2s93JzM1G3)
   This will make it much easier to develop locally.

# Cache Issues

If you are experiencing cache issues with environment variables in the .env file
run the following command:

`npx expo start --clear`
https://docs.expo.dev/guides/environment-variables/

# Deployments

### Preview Branch

In order to deploy your local branch in preview mode, run the following command:  
`npm run vercel:preview`  
You will need to log in with our team email account.  
The console will output a preview url for viewing.

Preview mode can be run on any branch to preview how the site will look on Vercel.  
It is encouraged to use preview mode before merging changes into main.

### Preview PR

PR Previews can be viewed from the bot comment at the bottom of the PR.
PR Previews can also be viewed in the `Publish Preview` task of the `app_preview` job.  
The website link allows you to add comments directly to the webpage!

## This Project uses React-Native-Web. This means we will share code for the app and the website and avoid duplicating our work.
