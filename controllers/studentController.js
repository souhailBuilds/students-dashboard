const { Student } = require("./../models/model");
async function addStudent(req, res) {
  // we save a new student in case post methode is trigger
  // so best way is to avoid .save() and use await with create()
  //new Student(req.body).save();
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json({
      status: "success",
      data: newStudent,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

async function getStudents(req, res) {
  try {
    const { category, prof, paymentStatu, phoneNumber, fullName } = req.query;
    const query = {};
    if (!!category) {
      query.category = category;
    }
    if (!!prof) {
      query.prof = prof;
    }

    if (paymentStatu === "due soon") {
      const afterThreeDays = Date.now() + 86400000 * 3;
      query.nextPayment = {
        $gte: new Date(Date.now()),
        $lte: new Date(afterThreeDays),
      };
    }

    if (prof === "all students" && !!category) query.category = category;

    if (paymentStatu === "late") {
      query.nextPayment = { $lt: new Date(Date.now()) };
    }

    if (paymentStatu === "paid") {
      query.hasPaid = true;
    }
    if (paymentStatu === "not paid") {
      query.hasPaid = false;
    }

    if (!!phoneNumber) {
      query.phoneNumber = phoneNumber;
    }

    if (!!fullName) {
      const parts = fullName.trim().split(" ");
      if (parts.length === 2) {
        query.firstName = { $regex: parts[0], $options: "i" };
        query.lastName = { $regex: parts[1], $options: "i" };
      } else {
        // if user enter just oen word like souhail no lastname
        query.$or = [
          { firstName: { $regex: fullName, $options: "i" } },
          { lastName: { $regex: fullName, $options: "i" } },
        ];
      }
    }

    const filtredStudents = await Student.find(query);
    res.status(200).json({
      status: "success",
      results: filtredStudents.length,
      data: {
        filtredStudents,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
}

async function getStats(req, res) {
  try {
    const afterThreeDays = Date.now() + 86400000 * 3;
    const paidStudents = await Student.find({ hasPaid: true });
    const notPaidStudent = await Student.find({ hasPaid: false });
    const lateStudent = await Student.find({
      nextPayment: { $lt: new Date(Date.now()) },
    });
    const pendingStudent = await Student.find({
      nextPayment: {
        $gte: new Date(Date.now()),
        $lte: new Date(afterThreeDays),
      },
    });

    const paymentStudentsData = {
      paid: paidStudents.length,
      notPaid: notPaidStudent.length,
      late: lateStudent.length,
      pending: pendingStudent.length,
    };
    console.log("here", paymentStudentsData);
    res.json(paymentStudentsData);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
}

async function editStudent(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
}

async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
}
module.exports = {
  addStudent,
  getStudents,
  getStats,
  editStudent,
  getStudentById,
};
