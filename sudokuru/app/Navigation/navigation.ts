import { CommonActions } from "@react-navigation/native";
// export const safeNavigate = (navigation: any, target: any, params?: any) => {
//   if (navigation.getParent()){
//     navigation.getParent().navigate(target, params);
//   } else {
//     navigation.navigate(target, params);
//   }
// };

// function getRootNavigation(nav: any) {
//   let current = nav;
//   while (typeof current?.getParent === "function" && current.getParent()) {
//     current = current.getParent();
//   }
//   return current;
// }

// export const safeNavigate = (navigation: any, target: string, params?: any) => {
//   //const navToUse = navigation.getParent() || navigation;
//   const navToUse = getRootNavigation(navigation);

//   navToUse.navigate(target, params);

//   navigation.dispatch(
//     CommonActions.reset({
//       index: 0,
//       routes: [{ name: target, params }],
//     }),
//   );

//   // Log the current navigation state
//   try {
//     const state = navToUse.getState?.();
//     console.log("Navigation state after navigating to", target, ":", state);
//   } catch (err) {
//     console.warn("Could not get navigation state:", err);
//   }
// };

import { navigationRef } from "./navigationRef";

// export function safeNavigate(target: any, params?: any) {
//   console.log(target, params);
//   if (navigationRef.isReady()) {
//     //navigationRef.navigate(target, params);
//     navigationRef.dispatch({
//       ...CommonActions.reset({
//         index: 0,
//         routes: [{ name: target, params }],
//       }),
//       target: navigationRef.getRootState().key,
//     });

//     try {
//       const state = navigationRef.getRootState();
//       console.log('Navigation state after navigation:', state);
//     } catch (err) {
//       console.warn('Could not get navigation state:', err);
//     }
//   }
// }

function getRootNavigation(nav: any) {
  let current = nav;
  while (typeof current?.getParent === "function" && current.getParent()) {
    current = current.getParent();
  }
  return current;
}

export function safeNavigate(target: any, params?: any) {
  console.log(target, params);
  if (navigationRef.isReady()) {
    const navToUse = getRootNavigation(navigationRef);
    //navToUse.navigate(target, params);
    navigationRef.dispatch({
      ...CommonActions.reset({
        index: 0,
        routes: [{ name: target, params }],
      }),
      target: navigationRef.getRootState().key, // ensure it applies to the root
    });

    try {
      const state = navigationRef.getRootState();
      console.log("Navigation state after navigation:", state);
    } catch (err) {
      console.warn("Could not get navigation state:", err);
    }
  }
}
