import joi from "joi";

const person = {
  name: "Ahmed",
  age: 20,
  email: "moamen@gmail.com",
  isMarried: false,
  password: "123456",
  confirmPassword: "123456",
  //   skills: ["HTML", "CSS"],
  skills: [{ frontend: ["HTML", "CSS"] }],
};

const schema = joi.object({
  name: joi.string().min(3).max(20).required(),
  age: joi.number().min(18).max(80),
  email: joi.string().email().required(),
  isMarried: joi.boolean(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
  //   skills: joi.array().items(joi.string().required()),
  skills: joi.array().items(
    joi.object({
      frontend: joi.array().items(joi.string().required()).required(),
    })
  ),
});

const result = schema.validate(person, { abortEarly: false });
console.log(result);
