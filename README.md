# Apollo Client useSyncExternalStore Polyfill Bug Reproduction

Reproduces a race condition in Apollo Client's `useSyncExternalStore` polyfill where state updates occur on unmounted React components.

## Issue

When using React 17 (no native `useSyncExternalStore`), Apollo Client uses its own polyfill. If a component unmounts while a query refetch is in flight, the polyfill attempts to update the unmounted component's state.

## Reproduction

```bash
yarn install
yarn test
```

## Expected Result

You should see this stack trace:

```
console.error
    Warning: An update to UserList inside a test was not wrapped in act(...).

    When testing, code that causes React state updates should be wrapped into act(...):

    act(() => {
      /* fire events that update state */
    });
    /* assert on the output */

    This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act
        at UserList (/home/user/workspace/_sandbox/apollo-bug-repro/src/components/user-list.tsx:21:53)
        at ApolloProvider (/home/user/workspace/_sandbox/apollo-bug-repro/node_modules/@apollo/client/react/context/ApolloProvider.js:6:21)
        at MockedProvider (/home/user/workspace/_sandbox/apollo-bug-repro/node_modules/@apollo/client/testing/react/MockedProvider.js:10:28)

      at printWarning (node_modules/react-dom/cjs/react-dom.development.js:67:30)
      at error (node_modules/react-dom/cjs/react-dom.development.js:43:5)
      at warnIfNotCurrentlyActingUpdatesInDEV (node_modules/react-dom/cjs/react-dom.development.js:24064:9)
      at dispatchAction (node_modules/react-dom/cjs/react-dom.development.js:16135:9)
      at handleStoreChange (node_modules/@apollo/client/react/hooks/useSyncExternalStore.js:90:21)
      at setResult (node_modules/@apollo/client/react/hooks/useQuery.js:392:5)
      at Object.onNext [as next] (node_modules/@apollo/client/react/hooks/useQuery.js:225:13)
      at notifySubscription (node_modules/zen-observable/lib/Observable.js:135:18)
      at onNotify (node_modules/zen-observable/lib/Observable.js:179:3)
      at SubscriptionObserver.next (node_modules/zen-observable/lib/Observable.js:235:7)
      at node_modules/@apollo/client/utilities/observables/iteration.js:7:68
          at Array.forEach (<anonymous>)
      at Object.iterateObserversSafely (node_modules/@apollo/client/utilities/observables/iteration.js:7:25)
      at ObservableQuery.iterateObserversSafely [as reportResult] (node_modules/@apollo/client/core/ObservableQuery.js:781:13)
      at Object.next (node_modules/@apollo/client/core/ObservableQuery.js:712:27)
      at node_modules/@apollo/client/utilities/observables/iteration.js:7:68
          at Array.forEach (<anonymous>)
      at iterateObserversSafely (node_modules/@apollo/client/utilities/observables/iteration.js:7:25)
      at Object.next (node_modules/@apollo/client/utilities/observables/Concast.js:61:21)
      at notifySubscription (node_modules/zen-observable/lib/Observable.js:135:18)
      at onNotify (node_modules/zen-observable/lib/Observable.js:179:3)
      at SubscriptionObserver.next (node_modules/zen-observable/lib/Observable.js:235:7)
      at node_modules/@apollo/client/utilities/observables/asyncMap.js:24:107
```

## Root Cause

Apollo Client's `handleStoreChange` function calls `forceUpdate({ inst: inst })` without checking if the component is still mounted.

**Location**: `node_modules/@apollo/client/react/hooks/useSyncExternalStore.js:90:21`
