import * as express from 'express';
import S3 from './AWS';
import * as settings from '../settings.json';
const awsRoutes = express.Router();

const buckets = (<any>settings).buckets;

awsRoutes
	.get('/getDumpLink/:dbName', (req: express.Request, res: express.Response) => {
		let { dbName = null } = req.params;

		if (dbName) {
			console.log(buckets.dumps)
			let s3res = S3.getSignedUrl('getObject', {
				Bucket: buckets.dumps,
				Key: `${dbName}.gz`,
				ResponseContentEncoding: 'gzip'
			}, (err, result) => {

				res.json({ isError: false, data: result});
			});

		} else {

			res.status(400).json({ isError: true, message: 'no valid body provided' });
		}
	})
	.get('/getDumpLink', (req, res) => {
		res.end('err')
	});

export default awsRoutes;
