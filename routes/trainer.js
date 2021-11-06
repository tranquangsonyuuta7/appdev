var express = require('express');
var router = express.Router();
const database = require("../database/models/index");
const TrainerCourse = database.db.TrainerCourse;
const TraineeCourse = database.db.TraineeCourse;
const Course = database.db.Course;
const Trainee = database.db.Trainee;
const Trainer = database.db.Trainer;

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const {userId} = req.session.user;
    const trainerCourses = await TrainerCourse.findAll({
      include: Course,
      where: {
        trainerId: userId
      }
    })

    res.render("layouts/master", {
      content: "../trainer_view/index",
      heading: "Trainer Dashboard",
      trainerCourses,
      trainerId: userId
    });

  } catch (error) {
    res.redirect('/auth')
  }
})

router.get('/viewTraineeOnCourse/:courseId', async(req, res) => {
  const {courseId} = req.params;

  const traineeCourses = await TraineeCourse.findAll({
    include: Trainee,
    where: {
      courseId
    }
  })

  res.render("layouts/master", {
    content: "../trainer_view/traineeOnCourse",
    heading: "Trainees on Course",
    traineeCourses,
  });

})

router.get('/updateTrainer/:trainerId', async (req, res) => {
  const {trainerId} = req.params;

  const trainer = await Trainer.findOne({
    where:{
      id: trainerId
    }
  })

  res.render("layouts/master", {
    content: "../trainer_view/update",
    heading: "Update Trainer",
    trainer
  });

})

router.post('/editTrainer', async (req, res) => {
  const {id, fullname, specialty, age, address, email} = req.body;

  const updatedTrainer = await Trainer.update(
    {fullname, specialty, age, email, address},
    {
      where: {
        id
      }
    }
  )

  res.redirect('/trainer');
})

module.exports = router;
