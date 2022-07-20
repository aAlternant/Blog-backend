import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').sort('-createdAt').exec();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            message: 'Не удалось получить статьи',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена!',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.error(error);
          res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена!',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.toLowerCase().trim().split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to create post',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.toLowerCase().trim().replace(/%20/g, '').split(','),
      },

      res.json({
        sucess: true,
      }),
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to update post',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    let tags = posts.map((obj) => obj.tags.flat().slice(0, 5)).flat();
    while (tags.length > 5) {
      tags.shift();
    }
    tags = tags.map((tag) => tag.replace(/%20/g, '').trim());

    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
};

export const getByTag = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    const sortedPosts = posts.filter((obj) => obj.tags.includes(req.params.tag));

    res.json(sortedPosts);
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      message: 'Не удалось найти тег',
    });
  }
};

export const sortByPopular = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(10).sort({ viewsCount: -1 }).populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      message: 'Не удалось отсортировать статьи',
    });
  }
};
