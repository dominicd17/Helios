const User = require('../Models/userModel');
const userController = {};

userController.updateArn = async (req, res, next) => {
  console.log(req.body);

  try {
    const origUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { arn: req.body.newArn }
    );
    // const update = { arn: req.body.newArn };
    // await origUser.updateOne(update);
    // const updatedUser = await User.updateOne(
    //   { email: req.body.email },
    //   { arn: req.body.newArn }
    // );
    // console.log(updatedUser);
    const doubleCheck = await User.findOne({ email: req.body.email });
    console.log(doubleCheck);
    if (doubleCheck) {
      res.locals.confirmation = { status: true, arn: doubleCheck.arn };
      return next();
    } else {
      res.locals.confirmation = { status: false };
      return next();
    }
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

userController.createUser = (req, res, next) => {
  User.create(
    {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      arn: '',
    },
    (err, result) => {
      if (err) {
        console.log('create user error ', err);
        if (err.code === 11000) {
          console.log('duplicate password');
          res.locals.confirmation = { confirmation: false, email: false };
          return next();
        }
        return next(err);
      }
      console.log(result);
      res.locals.confirmation = {
        confirmation: true,
        emailStatus: true,
        userInfo: {
          email: result.email,
          firstName: result.firstName,
        },
      };
      return next();
    }
  );
};

userController.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (await user.comparePassword(req.body.password)) {
      res.locals.confirmation = {
        confirmed: true,
        userInfo: {
          email: user.email,
          firstName: user.firstName,
          arn: user.arn,
        },
      };
      return next();
    } else {
      res.locals.confirmation = {
        confirmed: false,
      };
      return next();
    }
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

userController.addArn = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { arn: req.body.arn },
      { new: true }
    );
    return next();
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

module.exports = userController;
