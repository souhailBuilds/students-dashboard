const { Student } = require("./../models/model");
function addStudent(req, res) {
  new Student(req.body).save();
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
      query.hasPaid = "oui";
    }
    if (paymentStatu === "not paid") {
      query.hasPaid = "no";
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
    res.json(filtredStudents);
  } catch (error) {
    console.log(error);
  }
}

async function getStats(req, res) {
  try {
    const afterThreeDays = Date.now() + 86400000 * 3;
    const paidStudents = await Student.find({ hasPaid: "oui" });
    const notPaidStudent = await Student.find({ hasPaid: "no" });
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
    console.log(error);
  }
}
module.exports = { addStudent, getStudents,getStats };
