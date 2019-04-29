//Static Data for Front-End only testing & development
let testPeople = [
  {
    first_name: "Barbara ğ",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG/176px-A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG",
    last_name: "Belle",
    middle_name: "",
    stints: [{
      end_date: "2015-08-20",
      short_name: "",
      start_date: "2015-08-17",
      stint_type: "residency",
      title: ""
    }],
    person_id: 1
  }, {
    first_name: "fIrSt ç",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cattleya_Portia.jpg/158px-Cattleya_Portia.jpg",
    last_name: "Portia",
    middle_name: "",
    stints: [{
      end_date: "",
      short_name: "",
      start_date: "2018-07-30",
      stint_type: "employment",
      title: "Career facilitator"
    }],
    person_id: 2
  },
  {
    first_name: "Nobile's",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Blc_Nobiles_carnival.jpg/176px-Blc_Nobiles_carnival.jpg",
    last_name: "Carnival",
    middle_name: "",
    stints: [{
      end_date: "2016-03-24",
      short_name: "W2'16",
      start_date: "2016-01-04",
      stint_type: "retreat",
      title: ""
    }],
    person_id: 3
  },
  {
    first_name: "Mivá",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/A_and_B_Larsen_orchids_-_Cattleya_Miva_Breeze_Alize_930-23.jpg/89px-A_and_B_Larsen_orchids_-_Cattleya_Miva_Breeze_Alize_930-23.jpg",
    last_name: "Alize",
    middle_name: "",
    stints: [{
      end_date: "2015-12-17",
      short_name: "F2'15",
      start_date: "2015-09-28",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "2018-01-12",
      short_name: "m1'18",
      start_date: "2018-01-08",
      stint_type: "retreat",
      title: ""
    }],
    person_id: 4
  }, {
    first_name: "Mârjorie",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/A_and_B_Larsen_orchids_-_Cattleya_Marjorie_Hausermann_York_812-4.jpg/191px-A_and_B_Larsen_orchids_-_Cattleya_Marjorie_Hausermann_York_812-4.jpg",
    last_name: "York",
    middle_name: "Hausermann",
    stints: [{
      end_date: "2013-05-02",
      short_name: "W'13",
      start_date: "2013-02-11",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "2018-05-10",
      short_name: "",
      start_date: "2017-05-30",
      stint_type: "experimental",
      title: "Exploring",
    }],
    person_id: 5
  },
  {
    first_name: "LIttlë",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/A_and_B_Larsen_orchids_-_Cattleya_Little_AngelDSCN3349.JPG/176px-A_and_B_Larsen_orchids_-_Cattleya_Little_AngelDSCN3349.JPG",
    last_name: "Angël",
    middle_name: "",
    stints: [{
      end_date: "2016-02-11",
      short_name: "",
      start_date: "2016-02-08",
      stint_type: "residency",
      title: ""
    }, {
      end_date: "2016-02-26",
      short_name: "",
      start_date: "2016-02-22",
      stint_type: "residency",
      title: ""
    }, {
      end_date: "2016-03-04",
      short_name: "",
      start_date: "2016-02-29",
      stint_type: "residency",
      title: ""
    }],
    person_id: 6
  },
  {
    first_name: "Hermìne",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cattleya_Hermine.jpg/180px-Cattleya_Hermine.jpg",
    last_name: "Last",
    middle_name: "",
    stints: [{
      end_date: "2015-11-05",
      short_name: "F1'15",
      start_date: "2015-08-17",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "2016-09-22",
      short_name: "F1'16",
      start_date: "2016-08-15",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "2018-05-10",
      short_name: "",
      start_date: "2017-07-26",
      stint_type: "facilitatorship",
      title: ""
    }],
    person_id: 7
  }
]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomPerson(filter = 'all') {
  if (process.env.REACT_APP_USE_TEST_DATA === 'true') {
    let data = testPeople.slice().sort(function(a, b) {
      return Math.random() - Math.random();
    }).slice(0, 4);
    return new Promise(async function (res, rej) {
      console.log(data);
      await sleep(1000);
      res(data)
    });
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
