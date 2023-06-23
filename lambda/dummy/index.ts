import { S3 } from "aws-sdk";

const s3 = new S3();

export const handler = () => {
  console.log("hello world");
  const a = 'test'
  return { foo: "bar", a };
};
