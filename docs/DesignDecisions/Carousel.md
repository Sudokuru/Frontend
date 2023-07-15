# Carousel Design Decisions

We have decided to use the react-native-reanimated-carousel component created by [dohooo](https://github.com/dohooo/react-native-reanimated-carousel).  
However there is a bug related to the scroll wheel being [inverted on web](https://github.com/dohooo/react-native-reanimated-carousel/issues/357).  
This issue has been resolved by using [patch package](https://www.npmjs.com/package/patch-package) to hardcode the fix.  
This solution is less than ideal but for the purposes of the project it works

### Update 3/17/2023

While we were using webpack, the code for carousel component was being drawn from the `lib` folder for web
and the `src` folder for mobile. This allowed me to implement the solution above by hardcoding a negative sign in the `lib` folder.

However, now that we have switched to using Universal Metro for both web and mobile, the code for the carousel
component is being taken from the `src` folder for both platforms. This means the previous hardcoded "fix" no longer works

The new solution is to use parameterization as [described here](https://github.com/dohooo/react-native-reanimated-carousel/issues/357)

### Update 6/10/2023

We have abandoned the Carousel component and are no longer using it. This was mainly due to time constraints and the buggyness of the carousel.
This documentation will be kept in case there is ever a need to use this component again.
