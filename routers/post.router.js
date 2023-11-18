const express = require('express');
const router = express.Router();

const { Posts } = require('../models');
const db = require('../config/config');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth.middleware');

/*
{
  "title":"아이폰 XR",
  "content": "아이폰 팔아요"
}

{
  "email":"wowwow@naver.com",
  "password": "wowwow00"
}
*/

//상품 생성 API
router.post('/products', authMiddleware, async (req, res) => {
    const userId = res.locals.user.userId;
    const { title, content } = req.body;
    if (!title || !content) {
        return res
            .status(400)
            .json({ Message: '데이터 형식이 올바르지 않습니다.' });
    }
    const post = await Posts.create({
        title,
        content,
        userId,
    });
    const createdProduct = {
        title: post.title,
        content: post.content,
        status: post.status,
        userId: post.userId,
        createdAt: post.createdAt,
    };
    res.status(201).json({
        product: createdProduct,
        message: '판매 상품을 등록하였습니다.',
    });
});

module.exports = router;
