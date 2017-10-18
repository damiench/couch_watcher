import * as dotenv from 'dotenv';

// first of all initialize env from '.env file'
dotenv.config();

import * as express from 'express';
import routes from './routes';
import './db_dump';
// getting environment variables
const { PORT = 3000 } = process.env;

// create app instance
let app = express();

app.use('/', routes);

app.listen(PORT, (err) => {
	if (err)
		return console.log(err);

	return console.log(`Server listens to port ${PORT}`);
});
