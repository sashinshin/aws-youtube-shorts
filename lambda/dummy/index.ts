import { S3 } from "aws-sdk";

const s3 = new S3();

export const handler = () => {
  console.log("hello world");
  return { foo: "bar" };
};
