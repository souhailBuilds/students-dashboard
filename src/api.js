// get data about how many not paid and how many paid and so one for
// draw the circle data in dashboard
export async function getStudentStats() {
  try {
    const data = await fetch("http://127.0.0.1:9000/students/stats", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const statData = await data.json();
    return statData;
  } catch (error) {
    console.log(error);
  }
}

export async function editStudent(id, student) {
  try {
    const data = await fetch(`http://127.0.0.1:9000/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const res = await data.json();
    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteStudent(id) {
  try {
    const data = await fetch(`http://127.0.0.1:9000/students/${id}`, {
      method: "DELETE",
    });

    const res = await data.json();
    return res;
  } catch (err) {
    console.log(err);
  }
}

export async function getStudentById(id) {
  try {
    const data = await fetch(`http://127.0.0.1:9000/students/${id}`, {
      method: "GET",
    });

    const res = await data.json();
    console.log("i did it", res);
    return res;
  } catch (err) {
    console.log(err);
  }
}

// this function is for calling data from the database acccording the
// user choice
export async function getDataListByCategory(
  targetPersons,
  query,
  choice,
  combineFilters = false,
  paymentStat,
  urlChunck,
  searchBarFilter = false,
) {
  let url = "";
  if (searchBarFilter) {
    url = `http://127.0.0.1:9000/students?${query}=${choice}`;
  } else if (combineFilters) {
    url = `http://127.0.0.1:9000/students?${urlChunck}&paymentStatu=${paymentStat}`;
  } else {
    url = `http://127.0.0.1:9000/${targetPersons}?${query}=${choice}`;
  }

  try {
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const listData = await data.json();
    return listData;
  } catch (error) {
    console.log(error);
  }
}

// we send user data to our server after user has submit his form
export async function sendDataInfos(studentObj, parametre) {
  try {
    const dashboardUrl = await fetch(`http://127.0.0.1:9000/${parametre}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(studentObj),
    });

    const data = await dashboardUrl.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}
