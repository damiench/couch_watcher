import * as express from 'express';
const couchRouter = express.Router();

couchRouter
	.get('/', (req: express.Request, res: express.Response) => {
		let { dbName } = req.body;

		res.end('bla');
	});
