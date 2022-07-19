import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getAllComments = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    const coms = posts.map((post) => post.comments);

    console.log(coms);

    let readyComs = coms.filter((obj) => obj.length > 0).flat();

    while (readyComs.length > 5) {
      readyComs.pop();
    }

    res.json(readyComs);
  } catch (error) {
    console.warn(error);
    res.status(504).json({
      message: 'Комментарии не найдены',
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = req.body.comment;
    const user = await UserModel.findById(req.userId);

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          comments: {
            comment,
            user,
          },
        },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            message: 'Не удалось добавить комментарий',
          });
        }

        res.json(doc);
      },
    );
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось добавить комментарий',
    });
  }
};
