
# Carousel Design Decisions

We have decided to use the react-native-reanimated-carousel component created by [dohooo](https://github.com/dohooo/react-native-reanimated-carousel)<br>
However there is a bug related to the scroll wheel being [inverted on web](https://github.com/dohooo/react-native-reanimated-carousel/issues/357)<br>
This issue has been resolved by using [patch package](https://www.npmjs.com/package/patch-package) to hardcode the fix.<br>
This solution is less than ideal but for the purposes of the project it works<br>


