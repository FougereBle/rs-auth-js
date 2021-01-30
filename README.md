# RS Auth JS

RS Auth JS est une bibliothèque pour gérer l'authentification côté Frontend.

Il requière une API Backend pour fonctionner.

## Installation

```
npm i https://github.com/FougereBle/rs-auth-js.git
```

## Initialisation

RS Auth JS à besoin d'être initialisé avant de pouvoir être utilisé.

```js
import AuthSDK from "rs-auth-js";

AuthSDK.initialize({
  apiURL: null, // URL de l'API
  loginPath: "/auth/login", // Route de l'API pour la connexion
  registerPath: "/auth/register", // Route de l'API pour l'inscription
  mePath: "/auth/me", // Route de l'API pour récupérer l'utilisateur
  userVar: "user", // Nom de la variable contenant l'utilisateur (retourné par l'API)
  tokenVar: "token", // Nom de la variable contenant le token (retourné par l'API)
  cookieDuration: 60 * 60 * 24 * 30, // Durée des cookies (en seconde)
});
```

## Connexion

Pour connecter un utilisateur.

Si `rememberMe` est à `true`, un Cookie `auth.token` sera installé.

Cette fonction retourne, entre autre, l'utilisateur. Celui-ci devra être stocké (par exemple, dans un Store) par votre application.

```
AuthSDK.Auth.login(credentials, rememberMe)
```

```js
import AuthSDK from "rs-auth-js";

const response = await AuthSDK.Auth.login(
  {
    email: "email@example.com",
    password: "password",
  },
  true
);

console.log(response);

/*
{
  user: Utilisateur retourné par l'API
  token: Token retourné par l'API
}
*/
```

## Auto Login

Fonction à appeller pour connecter automatiquement l'utilisateur.

L'utilisateur doit s'être connecté avant pour que l'Auto Login connecte l'utilisateur.

Cette fonction retourne, entre autre, l'utilisateur. Celui-ci devra être stocké (par exemple, dans un Store) par votre application.

```
AuthSDK.Auth.autoLogin()
```

```js
import AuthSDK from "rs-auth-js";

const response = await AuthSDK.Auth.autoLogin();

console.log(response);

/*
{
  user: Utilisateur retourné par l'API
  token: Token retourné par l'API
}
*/
```

## Déconnexion

Déconnecte l'utilisateur

Si vous avez stocké un utilisateur dans votre application comme recommandée juste avant, pensez à le supprimer.

```
AuthSDK.Auth.logout()
```

```js
import AuthSDK from "rs-auth-js";

const response = AuthSDK.Auth.logout();

console.log(response);

/*
{
  user: null
  token: null
}
*/
```

## Inscription

Bientôt.
