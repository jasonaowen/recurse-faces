export function getRandomPerson() {
  return fetch('/api/people/random', {
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
