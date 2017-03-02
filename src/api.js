//Static Data for Front-End only testing & development
let testPeople = [
  {
    first_name: "Barbara ğ",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG/176px-A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG",
    last_name: "Belle",
    middle_name: "",
    person_id: 1
  }, {
    first_name: "fIrSt ç",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cattleya_Portia.jpg/158px-Cattleya_Portia.jpg",
    last_name: "Portia",
    middle_name: "",
    person_id: 2
  },
  {
    first_name: "Nobile's",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Blc_Nobiles_carnival.jpg/176px-Blc_Nobiles_carnival.jpg",
    last_name: "Carnival",
    middle_name: "",
    person_id: 3
  },
  {
    first_name: "Mivá",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/A_and_B_Larsen_orchids_-_Cattleya_Miva_Breeze_Alize_930-23.jpg/89px-A_and_B_Larsen_orchids_-_Cattleya_Miva_Breeze_Alize_930-23.jpg",
    last_name: "Alize",
    middle_name: "",
    person_id: 4
  }, {
    first_name: "Mârjorie",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/A_and_B_Larsen_orchids_-_Cattleya_Marjorie_Hausermann_York_812-4.jpg/191px-A_and_B_Larsen_orchids_-_Cattleya_Marjorie_Hausermann_York_812-4.jpg",
    last_name: "York",
    middle_name: "Hausermann",
    person_id: 5
  },
  {
    first_name: "LIttlë",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/A_and_B_Larsen_orchids_-_Cattleya_Little_AngelDSCN3349.JPG/176px-A_and_B_Larsen_orchids_-_Cattleya_Little_AngelDSCN3349.JPG",
    last_name: "Angël",
    middle_name: "",
    person_id: 6
  },
  {
    first_name: "Hermìne",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cattleya_Hermine.jpg/180px-Cattleya_Hermine.jpg",
    last_name: "Last",
    middle_name: "",
    person_id: 7
  }
]

export function getRandomPerson(filter = 'all') {
  if ("REACT_APP_USE_TEST_DATA" in process.env) {
    let data = testPeople[Math.ceil(Math.random() * 100) % testPeople.length]
    return new Promise((res, rej) => res(data));
  } else {
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
    });
  }
}
