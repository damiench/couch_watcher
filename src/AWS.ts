import * as AWS from 'aws-sdk';

AWS.config.loadFromPath('../settings-aws.json');

export default new AWS.S3({ apiVersion: '2006-03-01' });
