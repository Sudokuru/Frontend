## Common Issues:

#### Data is not being returned from the Database call

- First check the console and the network tab of inspect element. These may display errors that can help you identify the issue.
- If you have been logged in too long, you access token may have expired. Check to see if you are receiving
  401 errors in the Network tab of inspect element. If this is the case, try logging out and logging back in again.
- The mobile app has issues with sending and receiving data from 'localhost' urls, it will not work.
- If you are seeing CORS errors `has been blocked by CORS policy: No 'Access-Control-Allow-Origin'`
  you need to enable the CORS Unblock plugin linked above
- If you are receiving 404 errors, try initializing your local database with puzzles by using the
  [Postman workspace](https://documenter.getpostman.com/view/23651156/2s93JzM1G3)
