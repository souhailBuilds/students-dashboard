const { Teacher } = require("./../models/model");

async function getTeachersList(req, res) {
  // send all teachers list
  try {
    const allTeacher = await Teacher.find({
      category: req.query.category,
    });

    res.json(allTeacher);
  } catch (error) {
    console.log(error);
  }
}

function addNewTeacher(req, res) {
  new Teacher(req.body).save();
}

module.exports = { getTeachersList, addNewTeacher };
