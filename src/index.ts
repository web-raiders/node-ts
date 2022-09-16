import express from 'express';
import passport from 'passport';
import cors from 'cors';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import 'reflect-metadata';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { AddressInfo } from 'net';
import { rateLimit } from 'express-rate-limit';
import { types } from 'pg';
import routes from './routes';
import env from './config/env';

// this may fix a bigint retrieval issue
// common to typeorm and postgres
// eslint-disable-next-line no-undef
types.setTypeParser(20, BigInt);

const production = process.env.NODE_ENV === 'production';
// Create global app object
const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(cookieParser());

// Normal express config defaults
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride());

app.set('trust proxy', 1);

app.use(
  rateLimit({
    // Limit each IP to 50 requests for every minute.
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP, please try again after an hour.',

    // Skip rate limiting for authenticated users.
    // skip: (req, _res) => req.cookies.current_user && req.cookies.x_token,
  })
);

if (!production) {
  app.use(errorhandler());
}

// connect app to routes
app.use('/v1.0/api', routes);

// development error handler
if (!production) {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// routes
app.use(routes);
app.get('/', (req, res) => res.status(200).send({ message: 'hey there 👋🏾' }));
app.all('*', (req, res) => res.send({ message: 'route not found' }));

// start our server...
const server = app.listen(env.PORT || 3000, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Listening on port ${port}`);
});

export default app;
