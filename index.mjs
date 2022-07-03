import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import bindRoutes from './routes.mjs';

const app = express();

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

bindRoutes(app);

const PORT = process.env.PORT || 3004;
app.listen(PORT);

/* sudo service postgresql start */
