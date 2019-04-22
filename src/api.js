//Static Data for Front-End only testing & development
let testPeople = [
  {
    first_name: "Barbara ğ",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG/176px-A_and_B_Larsen_orchids_-_Cattleya_Barbara_Belle_DSCN8696.JPG",
    last_name: "Belle",
    middle_name: "",
    stints: [{
      end_date: "Thu, 20 Aug 2015 00:00:00 GMT",
      short_name: "",
      start_date: "Mon, 17 Aug 2015 00:00:00 GMT",
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
      start_date: "Mon, 30 Jul 2018 00:00:00 GMT",
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
      end_date: "Thu, 24 Mar 2016 00:00:00 GMT",
      short_name: "W2'16",
      start_date: "Mon, 04 Jan 2016 00:00:00 GMT",
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
      end_date: "Thu, 17 Dec 2015 00:00:00 GMT",
      short_name: "F2'15",
      start_date: "Mon, 28 Sep 2015 00:00:00 GMT",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "Fri, 12 Jan 2018 00:00:00 GMT",
      short_name: "m1'18",
      start_date: "Mon, 08 Jan 2018 00:00:00 GMT",
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
      end_date: "Thu, 02 May 2013 00:00:00 GMT",
      short_name: "W'13",
      start_date: "Mon, 11 Feb 2013 00:00:00 GMT",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "Thu, 10 May 2018 00:00:00 GMT",
      short_name: "",
      start_date: "Tue, 30 May 2017 00:00:00 GMT",
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
      end_date: "Fri, 11 Feb 2016 00:00:00 GMT",
      short_name: "",
      start_date: "Mon, 08 Feb 2016 00:00:00 GMT",
      stint_type: "residency",
      title: ""
    }, {
      end_date: "Fri, 26 Feb 2016 00:00:00 GMT",
      short_name: "",
      start_date: "Mon, 22 Feb 2016 00:00:00 GMT",
      stint_type: "residency",
      title: ""
    }, {
      end_date: "Fri, 04 Mar 2016 00:00:00 GMT",
      short_name: "",
      start_date: "Mon, 29 Feb 2016 00:00:00 GMT",
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
      end_date: "Thu, 05 Nov 2015 00:00:00 GMT",
      short_name: "F1'15",
      start_date: "Mon, 17 Aug 2015 00:00:00 GMT",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "Thu, 22 Sep 2016 00:00:00 GMT",
      short_name: "F1'16",
      start_date: "Mon, 15 Aug 2016 00:00:00 GMT",
      stint_type: "retreat",
      title: ""
    }, {
      end_date: "Thu, 10 May 2018 00:00:00 GMT",
      short_name: "",
      start_date: "Wed, 26 Jul 2017 00:00:00 GMT",
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
