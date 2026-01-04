# React Native Worklets error temporary workaround

The `react-native-reanimated` is now using a later version of the `react-native-worklets` library than the `Expo Go` Client.

 ERROR  [runtime not ready]: WorkletsError: [Worklets] Mismatch between JavaScript part and native part of Worklets (0.6.1 vs 0.5.1).

We can see this by running the following command:

```bash
$ npm list react-native-worklets
frontend
└─┬ sudokuru-frontend@1.0.0 -> .\sudokuru
  └─┬ react-native-reanimated@4.1.3
    └── react-native-worklets@0.6.1
```

We are currently fixing by setting a peer dependency to be set to `0.5.1`. However this is not ideal because then `react-native-reanimated` might depend on something in the later version of `react-native-worklets`.

Helpful resources:
- https://github.com/software-mansion/react-native-reanimated/issues/8432#issuecomment-3452451654

Quote from the linked comment for easy reading:

"Expo Go uses precompiled versions of libraries. For Expo 54, the precompiled version of Worklets is 0.5.1. Worklets 0.6.x might have different native code which would lead to runtime crashes - this is why we throw that QoL error about version mismatch. If you want to use newer worklets you have to opt into dev builds."
