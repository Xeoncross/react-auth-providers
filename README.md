## React Auth Providers

A collection of Components for handling user authentication and state in a reactjs application. I've collected all these after spending time trying to create a standard, reusble way to handle login flow with the 3 major frontend paterns:

- OAuth
- Plain REST/GraphQL Login
- Firebase
- AWS Amplify / Amazon Cognito

I'm in the process of making an actual package, but publishing what I have so far in the hopes of more feedback and helping others right away.

Demo application for handling a token (one of OAuth/Session/JWT) + user state:
https://codesandbox.io/s/react-hooks-login-with-token-user-provider-ybke8

Example of mounting when using multiple nested providers and state:
https://codesandbox.io/s/react-provider-context-hooks-usestate-5kgh2

## Secure Auth

A simple plan of avoiding both CSRF attacks and XSS attacks to steal sessions by combining the security of httpOnly cookies over HTTPS/TLS and a hashed token passed back by the client on every request.

The idea is simple, the token can be stolen, but cannot be used unless the attacker also has the secret from the cookie. Likewise, the cookie cannot be used unless the hashed token is also sent.

Since the cookie is `httpOnly` over HTTPS/TLS, the attacker will never be able to steal the session for use in another client. This means the only attack left is to get the victim to perform actions with a successful XSS attack that can load the hashed token from wherever it is stored (or use the same AJAX request functions), and then it can perform actions (CSRF) using the victims browser (only).

This might seem like only a partial win, but a hack allowing arbitrary Javascript to run on your clients browsers (XSS) leaves you with unavoidably big issues anyway. Both CORS and CSP headers are recommended.

- https://github.com/rs/cors
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src

Based on a question by [Magnus Jeffs Tovslid](https://security.stackexchange.com/q/184885/3927).

- http://cryto.net/%7Ejoepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
- http://cryto.net/%7Ejoepie91/blog/2016/06/19/stop-using-jwt-for-sessions-part-2-why-your-solution-doesnt-work/


## Resources

- https://reactjs.org/docs/hooks-reference.html
- https://github.com/the-road-to-learn-react/use-data-api
- https://aws.amazon.com/amplify/
- https://github.com/axios/axios#handling-errors
- https://github.com/ReactTraining/hooks-workshop/blob/master/modules/app/app-state.js
    - https://www.youtube.com/watch?v=1jWS7cCuUXw
- https://reactjs.org/docs/reconciliation.html
- https://reactjs.org/docs/hooks-intro.html