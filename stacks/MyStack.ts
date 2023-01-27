import { Api, Cognito, StackContext } from "@serverless-stack/resources";
import { App } from "aws-cdk-lib";

export function MyStack({ stack, app }: StackContext) {
  // Create Api
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
    },
    routes: {
      "GET /private": "functions/private.handler",
      "GET /public": {
        function: "functions/public.handler",
        authorizer: "none",
      },
    },
  });

  // Create auth provider
const auth = new Cognito(stack, "Auth", {
  login: ["email"],
});

// Allow authenticated users invoke API
auth.attachPermissionsForAuthUsers(stack, [api]);

  // Show the API endpoint and other info in the output
  stack.addOutputs({
    Region : app.region,
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}