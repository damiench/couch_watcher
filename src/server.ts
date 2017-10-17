import * as express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
// first of all initialize env from '.env file'
dotenv.config();
// getting environment variables
const { PORT = 3000 } = process.env;
// create app instance
let app = express();

// body parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(PORT, (err) => {
	if (err)
		return console.log(err);

	return console.log(`Server listens to port ${PORT}`);
});
