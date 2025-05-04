import bycrypt from "bcrypt";

export const hash = ({
  plainText,
  rounds = Number(process.env.SALT_ROUND),
}) => {
  return bycrypt.hashSync(plainText, rounds);
};

export const compareHash = ({ plainText, hashValue }) => {
  return bycrypt.compareSync(plainText, hashValue);
};
