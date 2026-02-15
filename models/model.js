const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Enter s il vous plait le prenom "],
    },
    lastName: {
      type: String,
      required: [true, "Enter s il vous plait le nom "],
    },
    phoneNumber: {
      type: String,
      required: [true, "Enter s il vous plait le numero de telephone "],
    },
    price: {
      type: Number,
      required: [true, "Enter s il vous plait le prix "],
    },
    address: {
      type: String,
      required: [true, "Enter s il vous plait l adresse "],
    },
    gender: {
      type: String,
      required: true,
      enum: ["garcon", "fille"],
    },
    image: {
      type: String,
      required: true,
    },
    prof: {
      type: String,
      required: true,
    },
    hasPaid: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    nextPayment: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      default: null,
    },

    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = { Student, Teacher };
