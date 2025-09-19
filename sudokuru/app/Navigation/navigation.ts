export const safeNavigate = (navigation: any, target: any, params?: any) => {
  const state = navigation.getState();
  const currentRoute = state.routes[state.index];

  if (currentRoute.name === target) {
    // Same stack → replace
    navigation.replace(target, params);
  } else {
    // Different drawer item → reset
    navigation.reset({
      index: 0,
      routes: [{ name: target, params }],
    });
  }
};
