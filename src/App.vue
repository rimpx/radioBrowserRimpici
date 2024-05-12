<template>
  <nav>
    <router-link to="/" exact>Home</router-link>
    <router-link to="/favorites" exact>Favourites</router-link>
    <router-link to="/planet" exact>Planet</router-link> 
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 10px;
  display: flex;
  justify-content: center; /* Centra i link orizzontalmente */
  gap: 20px; /* Distanza tra i link */
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none; /* Rimuove il sottolineato */
  padding: 10px;
}

nav a:hover {
  color: #3498db; /* Cambia colore al passaggio del mouse */
}

nav a.router-link-exact-active {
  color: #42b983; /* Colore per il link attivo */
}
</style>
