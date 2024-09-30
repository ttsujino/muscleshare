# Frontend of muscleshare app

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Run the development server:
```bash
yarn dev
```

3. Open [http://localhost:3010](http://localhost:3000) with your browser to see the result.


## Setting for Auth0
Based on this [QuickStart](https://github.com/auth0/nextjs-auth0).

1. Create a Regular Web Application in the Auth0 Dashboard.
2. Configure the following URLs for your application under the "Application URIs" section of the "Settings" page:

- Allowed Callback URLs: http://localhost:3010/api/auth/callback
- Allowed Logout URLs: http://localhost:3010/

2. Creating a `.env.local`
```
# A long, secret value used to encrypt the session cookie
AUTH0_SECRET='LONG_RANDOM_VALUE'
# The base url of your application
AUTH0_BASE_URL='http://localhost:3010'
# The url of your Auth0 tenant domain
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
# Your Auth0 application's Client ID
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
# Your Auth0 application's Client Secret
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```