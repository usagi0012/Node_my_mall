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
  "title":"아이폰 XR",
  "content": "아이폰 팔아요",
  "status": "SOLD_OUT"
}

{
  "email":"wowwow@naver.com",
  "password": "wowwow00"
}
*/

//상품 생성 API
router.post('/posts', authMiddleware, async (req, res) => {
    const userId = res.locals.user.userId;
    const { title, content } = req.body;

    //제목이나 내용 입력 안했을 때
    if (!title || !content) {
        return res
            .status(400)
            .json({ Message: '데이터 형식이 올바르지 않습니다.' });
    }

    //맞게 입력됐다면 생성
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

//상품 수정 API
router.put('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.user.userId;
    const { title, content, status } = req.body;
    const updatePost = await Posts.findOne({ where: { postId } });

    //상품이 있는지 조회
    if (!updatePost) {
        return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
    }

    //있으면 본인이 등록한 상품인지 확인
    if (updatePost.userId !== userId) {
        return res
            .status(401)
            .json({ Message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    //인증되었으면 상품 수정
    await Posts.update(
        {
            title: title,
            content: content,
            status: status,
        },
        { where: { postId } }
    );
    res.status(200).json({ Message: '상품정보를 수정하였습니다.' });
});

//상품 삭제 API
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.user.userId;
    const deletePost = await Posts.findOne({ where: { postId } });

    //상품이 있는지 조회
    if (!deletePost) {
        return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
    }

    //있으면 본인이 등록한 상품인지 확인
    if (deletePost.userId !== userId) {
        return res
            .status(401)
            .json({ Message: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }

    //인증되었으면 상품 삭제
    await Posts.destroy({ where: { postId } });
    res.status(200).json({ Message: '상품을 삭제하였습니다.' });
});

//상품 목록 조회 API
router.get('/posts', async (req, res) => {
    //최근에 수정된(업데이트된)순으로 정렬해서 조회하도록 함
    const posts = await Posts.findAll({
        attributes: [
            'postId',
            'title',
            'content',
            'userId',
            'status',
            'createdAt',
            'updatedAt',
        ],
        order: [['updatedAt', 'desc']],
    });
    res.status(200).json({ posts });
});

module.exports = router;
