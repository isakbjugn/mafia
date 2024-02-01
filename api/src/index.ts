import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import loginRouter from './routes/login';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import eventsRouter from './routes/events';
import duelsRouter from './routes/duels';
import passport from "passport";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello via Bun!");
});

app.use('/login', loginRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/duels', duelsRouter);

app.listen(port, () =>
  console.log(`Server kjører på port ${port}`
));
