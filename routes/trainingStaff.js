var express = require("express");
var router = express.Router();
const database = require("../database/models/index");
const Role = database.db.Role;
const Trainee = database.db.Trainee;
const Account = database.db.Accounts;
const AccountController = require("../controllers/account_controller");
const CourseController = require("../controllers/course_controller");
const CourseCategoryController = require("../controllers/courseCategory_controller");
const CourseCategory = database.db.CourseCategory;
const Course = database.db.Course;
const Trainer = database.db.Trainer;
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;

/* GET home page. */
router.get("/", async function (req, res) {
  const traineeAccounts = await Account.findAll({
    include: {
      model: Role,
      where: {
        name: "trainee",
      },
    },
  });
  const courseCategories = await CourseCategory.findAll();
  const courses = await Course.findAll({
    include: CourseCategory,
  });
  const trainerCourses = await TrainerCourse.findAll({
    include: [Trainer, Course],
  });

  // const traineeCourses = [];

  const traineeCourses = await TraineeCourse.findAll({
    include: [Trainee, Course],
  });

  res.render("layouts/master", {
    content: "../trainingStaff_view/index",
    traineeAccounts,
    courseCategories,
    courses,
    trainerCourses,
    traineeCourses
  });
});

// ================= Trainee =================== //
/* GET create trainee page. */
router.get("/createTrainee", async function (req, res) {
  const traineeRole = await Role.findOne({
    where: {
      name: "trainee",
    },
  });

  res.render("layouts/master", {
    content: "../trainee_view/create",
    traineeRole,
  });
});

router.post("/addTrainee", async function (req, res) {
  const {
    username,
    password,
    fullname,
    age,
    dateOfBirth,
    education,
    email,
    roleId,
  } = req.body;

  const trainee = await Trainee.create({
    fullname,
    age,
    dateOfBirth,
    education,
    email,
  });

  if (trainee) {
    await Account.create({
      username,
      password,
      roleId,
      userId: trainee.dataValues.id,
    });

    res.redirect("/trainingStaff");
  }
});

router.get("/updateTrainee/:id", async (req, res) => {
  const { id } = req.params;
  const traineeAccount = await Account.findOne({
    where: {
      id,
    },
    include: Role,
  });

  const { id: accountId, username, password } = traineeAccount;

  const traineeInfo = await Trainee.findOne({
    where: {
      id: traineeAccount.userId,
    },
  });

  const traineeData = {
    ...traineeInfo.dataValues,
    username,
    password,
    accountId,
  }; // destructuring ES6
  // res.send(traineeData);
  res.render("layouts/master", {
    content: "../trainee_view/update",
    traineeData,
  });
});

router.get("/deleteAccount", AccountController.deleteAccount, (req, res) => {
  res.redirect("/trainingStaff");
});

router.post("/editTrainee", async (req, res) => {
  // res.send(req.body)
  const {
    accountId,
    username,
    password,
    traineeId,
    fullname,
    education,
    dateOfBirth,
    age,
    email,
  } = req.body;
  const updatedAccount = await Account.update(
    { username, password },
    {
      where: {
        id: accountId,
      },
    }
  );

  const updatedTrainee = await Trainee.update(
    { fullname, education, dateOfBirth, age, email },
    {
      where: {
        id: traineeId,
      },
    }
  );
  res.redirect("/trainingStaff");
});

router.get("/viewAccount", AccountController.getAccount, (req, res) => {
  console.log("🚀 ~ file: trainingStaff.js ~ line 173 ~ router.get ~ req.account", req.account)
  res.render("layouts/master", {
    content: "../account_view/profile",
    account: req.account
    
  });
});
// ================= End Trainee =================== //

/* GET create course category page. */
router.get("/createCourseCategory", async function (req, res) {
  res.render("layouts/master", {
    content: "../courseCategory_view/create",
  });
});

router.post("/addCourseCategory", async function (req, res) {
  const { name, description } = req.body;
  const courseCategory = await CourseCategory.create({
    name,
    description,
  });

  res.redirect("/trainingStaff");
});

router.get(
  "/deleteCourseCategory",
  CourseCategoryController.deleteCourseCategory,
  (req, res) => {
    res.redirect("/trainingStaff");
  }
);

router.get('/updateCategory/:id', async (req, res) => {
  const { id } = req.params;

  const category = await CourseCategory.findOne({
    where: {
      id
    }
  })

  res.render("layouts/master", {
    content: "../courseCategory_view/update",
    category
  });
})

router.post('/editCategory', async (req, res) => {
  const { id, name, description } = req.body;

  const updatedCategory = await CourseCategory.update(
    {name, description},
    {
      where: {
        id
      }
    }
  )
  
  res.redirect("/trainingStaff");
})
/* GET create course page. */
router.get("/createCourse", async function (req, res) {
  const courseCategories = await CourseCategory.findAll();
  res.render("layouts/master", {
    content: "../course_view/create",
    courseCategories,
  });
});

router.post("/addCourse", async function (req, res) {
  const { name, description, courseCategoryId } = req.body;
  const course = await Course.create({
    name,
    description,
    courseCategoryId,
  });

  res.redirect("/trainingStaff");
});

router.get("/deleteCourse", CourseController.deleteCourse, (req, res) => {
  res.redirect("/trainingStaff");
});

router.get('/updateCourse/:id', async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOne({
    include: CourseCategory,
    where: {
      id
    }
  })

  const categories = await CourseCategory.findAll();

  res.render("layouts/master", {
    content: "../course_view/update",
    course,
    categories
  });
})

router.post('/editCourse', async (req, res) => {
  const { courseId, name, description, categoryId } = req.body;

  const updatedCourse = await Course.update(
    {name, description, courseCategoryId: categoryId},
    {
      where: {
        id: courseId
      }
    }
  )
  
  res.redirect("/trainingStaff");
})

// ================= Assign Trainer =================== //
router.get("/assignTrainer", async (req, res) => {
  const trainers = await Trainer.findAll();
  const courses = await Course.findAll();

  res.render("layouts/master", {
    content: "../trainer_view/assign",
    trainers,
    courses,
  });
});

router.post("/assignTrainer", async (req, res) => {
  try {
    const { trainerId, courseId } = req.body;
    // res.send(`${trainerId}, ${courseId}`);
    const result = await TrainerCourse.create({
      trainerId,
      courseId,
    });

    res.redirect("/trainingStaff");
  } catch (error) {
    console.log(
      "🚀 ~ file: trainingStaff.js ~ line 133 ~ router.post ~ error",
      error
    );
  }
});

router.get("/removeTrainerTask/:trainerId/:courseId", async (req, res) => {
  const { trainerId, courseId } = req.params;

  await TrainerCourse.destroy({
    where: {
      trainerId: trainerId,
      courseId: courseId,
    },
  });

  res.redirect("/trainingStaff");
});
// ================= End Assign Trainer =================== //

// ================= Assign Trainee =================== //
router.get("/assignTrainee", async (req, res) => {
  const trainees = await Trainee.findAll();
  const courses = await Course.findAll();

  res.render("layouts/master", {
    content: "../trainee_view/assign",
    trainees,
    courses,
  });
});

router.post("/assignTrainee", async (req, res) => {
  try {
    const { traineeId, courseId } = req.body;
    // res.send(`${trainerId}, ${courseId}`);
    const result = await TraineeCourse.create({
      traineeId,
      courseId,
    });

    res.redirect("/trainingStaff");
  } catch (error) {
    console.log(
      "🚀 ~ file: trainingStaff.js ~ line 133 ~ router.post ~ error",
      error
    );
  }
});

router.get("/removeTraineeTask/:traineeId/:courseId", async (req, res) => {
  const { traineeId, courseId } = req.params;

  await TraineeCourse.destroy({
    where: {
      traineeId: traineeId,
      courseId: courseId,
    },
  });

  res.redirect("/trainingStaff");
});
// ================= End Assign Trainee =================== //

// ================= Search Course =================== //
router.post("/searchCourseInfo", async (req, res) => {
  
  const {courseName } = req.body;
  
  const trainers = await TrainerCourse.findAll({
    include: [{
      model: Course,
      attributes: ['name'],
      where: {
        name: courseName
      }
    }, {
      model: Trainer,
      attributes: ['fullname']
    }],
    attributes: ['trainerId', 'courseId']
  })

  const trainees = await TraineeCourse.findAll({
    include: [{
      model: Course,
      attributes: ['name'],
      where: {
        name: courseName
      }
    }, {
      model: Trainee,
      attributes: ['fullname']
    }],
    attributes: ['traineeId', 'courseId']
  })

  res.render("layouts/master", {
    content: "../trainingStaff_view/search",
    trainers,
    trainees
  });

})


module.exports = router;
