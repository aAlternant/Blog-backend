import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Incorrect email adress').isEmail(),
  body('password', 'Too short password').isLength({ min: 6 }),
  body('fullName', 'Too short name').isLength({ min: 3 }),
  body('avatarUrl', 'Incorrect avatar URL').optional(),
];

export const loginValidator = [
  body('email', 'Incorrect email adress').isEmail(),
  body('password', 'Too short password').isLength({ min: 6 }),
];

export const postCreateValidator = [
  body('title', 'Too short title').isLength({ min: 3 }).isString(),
  body('text', 'Too short text').isLength({ min: 10 }).isString(),
  body('tags', 'Incorrect tags').optional().isString(),
  body('imageUrl', 'Incorrect image URL').optional().isString(),
];
