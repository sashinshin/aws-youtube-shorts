import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration } from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Construct } from 'constructs';

export class AwsYoutubeShortsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'CVPipeline', {
      pipelineName: 'CVPipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-youtube-shorts', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const bucket = new Bucket(this, 'TestBucket', {
      bucketName: "test-bucket-123e12easkldn8838923-12",
      publicReadAccess: true,
    });

    const dummy = new NodejsFunction(this, "dummyLambda", {
      description: "Lambda that uploads cv to s3 bucket",
      handler: "handler",
      entry: join(__dirname, "../lambda/dummy/index.ts"),
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:*"],
          resources: [`${bucket.bucketArn}/*`]
        }),
      ]
    });
  }
}
