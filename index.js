import express, { response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  postCreateValidator,
  loginValidator,
  registerValidator,
} from './validations/validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController, CommentsController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.xufox.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('Подключение к ДБ успешно'))
  .catch((err) => console.log('DB ERR: ' + err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
app.post('/auth/registration', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Теги
app.get('/tags', PostController.getLastTags);
app.get('/tags/:tag', PostController.getByTag);
// Комментарии
app.post('/posts/:id', checkAuth, CommentsController.createComment);
app.get('/comments', CommentsController.getAllComments);
// Посты
app.get('/posts', PostController.getAll);
app.get('/posts-sorted', PostController.sortByPopular);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.update,
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Сервер запущен!');
});
