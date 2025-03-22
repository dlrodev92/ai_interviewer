import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const secret_name = 'rds!db-24641014-be3e-4ba5-b47a-f1a0d378341d';

const client = new SecretsManagerClient({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function fetchDatabaseCredentials() {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT',
      })
    );

    if (!response.SecretString) {
      throw new Error('Secret string is empty');
    }

    const secret = JSON.parse(response.SecretString);
    const encodedPassword = encodeURIComponent(secret.password);
    const databaseUrl = `postgresql://${secret.username}:${encodedPassword}@${secret.host}:${secret.port}/${secret.dbname}`;

    console.log('\n✅ Your DATABASE_URL:');
    console.log(databaseUrl);
    console.log('\nAdd this to your .env file under DATABASE_URL=');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);

      // Additional debugging info
      console.log('\n🔍 Debug Info:');
      console.log('AWS_REGION:', process.env.AWS_REGION);
      console.log('AWS_ACCESS_KEY_ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
      console.log(
        'AWS_SECRET_ACCESS_KEY exists:',
        !!process.env.AWS_SECRET_ACCESS_KEY
      );
    }
    throw error;
  }
}

fetchDatabaseCredentials();
