## OAuth in React

Rather than using an external service like Firebase or AuthO, I would like to handle OAuth login to facebook, google, twitter myself. (Regardless of the backend, OAuth libraries that can verify and trade the token for user info abound).

Here is the basic flow:

1. React SPA opens seperate [popup/iframe/browser tab] to our server
2. Our server creates OAuth URL payload and issues redirect to fb/google/twitter
3. User login on fb/google/twitter redirect back to our server
4. Our server communicates with React SPA
    4.1. If same origin
        4.1.1. Using localStorage
        4.1.2. Using cookies
    4.2. Different origin
        4.2.1 using `window.postMessage()`
        4.2.2. using URL param (or token data) with client marker of some kind in it (socket.id, session id, nounce, etc...)
5. React SPA closes [popup/iframe/browser tab]


So to repeat, this assumes you will have a backend server that will handle the redirect and finally window.opener from inside the popup to return the session token:

```javascript
if (window.opener) {
    window.opener.postMessage({token: "session-token-here"}, "*");
}
```


## window.postMessage()
 
- Using a Browser Tab: https://medium.com/front-end-weekly/use-github-oauth-as-your-sso-seamlessly-with-react-3e2e3b358fa1
- window.opener.postMessage: OAuth flow completes on origin we control that sends message back to SPA that opened the popup: https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2. 
- [polling same-origin localstorage](https://github.com/lynndylanhurley/redux-auth/blob/master/src/actions/oauth-sign-in.js): https://github.com/lynndylanhurley/redux-auth looking for the data set by the popup loading the react application a second time after successful login. https://github.com/personalyze/redux-auth fork is the most updated with 100+ new commits

## different origin

- socket.io: socket id is passed to backend on open, so after login it knows which client just completed the flow: https://codeburst.io/react-authentication-with-twitter-google-facebook-and-github-862d59583105. 
- localstorage: OAuth flow redirects back to page that writes result to localstorage on the same origin: https://medium.com/@mattmazzola/react-simple-auth-react-redux-oauth-2-0-de6ea9df0a63. 


Since the actual browser needs to load and interact with a foreign window I've seen [window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) used as the way to handle login flow. Open a popup and then do one of the following:
Here is an article from 9 years ago about making a [Backwards compatible window.postMessage()](http://www.onlineaspect.com/2010/01/15/backwards-compatible-postmessage/) work for browsers older than IE 8. I would assume window.postMessage should be okay by now.


## Resources

- basic oauth button using postmessage: https://gist.github.com/danpantry/7e4a527cc421fd5f1a76
- react auth + go backend using JWT: https://github.com/IsraelAdura/go-postgres-jwt-react-starter
- react redux, oauth, and password login: https://github.com/shinework/react-oauth2-example
- passport.js backend, popup flow, redux store: https://medium.com/front-end-weekly/use-github-oauth-as-your-sso-seamlessly-with-react-3e2e3b358fa1
- firebase flow with HOC, router, and context: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
- window.open warnings: https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Avoid_resorting_to_window.open()
- same-origin for iframes: https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
- cross-domain iframes in javascript: https://github.com/ternarylabs/porthole
- react state, context, and reducer hooks to handle auth: https://auth0.com/blog/handling-authentication-in-react-with-context-and-hooks/
- simple react context with protected routes: https://codesandbox.io/s/p71pr7jn50
- useEffect(): https://overreacted.io/a-complete-guide-to-useeffect/

## IE 11 and below

> "postMessage function does not work between tabs/windows in IE8. As of IE11, this issue has not yet been fixed. Attempting to send a message to a different window or tab results in an exception with the text "Error: No such interface supported." 

https://web.archive.org/web/20150309062330/http://blogs.msdn.com/b/ieinternals/archive/2009/09/16/bugs-in-ie8-support-for-html5-postmessage-sessionstorage-and-localstorage.aspx

This can be tested here: http://www.debugtheweb.com/test/xdm/origin/


