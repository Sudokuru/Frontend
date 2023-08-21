# How to start the frontend app

Run `npm i` in the root folder  
Run `npm run start`

For testing with a mobile device you can download the Expo app.  
You will also need to be logged in to Expo on the development device (laptop/desktop that is running the code).  
To login type: `expo login` and fill out the parameters.

Contact Thomas to get added to the Expo organization so that you can log in with your own email and password.

For iOS, scan the QR code with your camera app, for Android you will need to scan the code from within the Expo app.

For Web, hit the w key to start up the website at `localhost:19000`

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
