export function getRandomPerson(filter = 'all') {
  return fetch('/api/people/random?filter=' + filter, {
    accept: 'application/json',
    credentials: "same-origin",
  }).then((response) => {
    return response.json();
  }).then((responseJson) => {
    if (responseJson.message === 'Access Denied') {
      console.log("Access denied!");
      window.location.pathname = "auth/recurse";
    } else {
      console.log(responseJson);
      return responseJson;
    }
  })
}
