const express = require('express');
const router = express.Router();

const { Users } = require('../models');
const db = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//회원가입 API
router.post('/users', async (req, res) => {
    const { email, password, confirmPassword, name } = req.body;
    //이메일 유효성 검사 (형식)
    const validEmail = (email) => {
        const emailRegex =
            /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        return emailRegex.test(email);
    };
    if (!validEmail(email)) {
        res.status(400).json({
            errorMessage: '잘못된 이메일 형식입니다.',
        });
        return;
    }

    //이메일 유효성 검사 (중복)
    const existsUsers = await Users.findOne({
        where: { email },
    });
    if (existsUsers) {
        res.status(400).json({
            errorMessage: '이미 가입된 이메일입니다.',
        });
        return;
    }

    //비밀번호 6자 미만
    if (password.length < 6) {
        res.status(400).json({
            errorMessage: '비밀번호는 최소 6자 이상으로 작성해주세요',
        });
        return;
    }

    //비밀번호 확인과 불일치
    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: '비밀번호를 다시 확인해주세요.',
        });
        return;
    }

    //전부 만족 시 회원가입(비번은 hash해서 저장)
    const hash = await bcrypt.hash(password, 10);
    const user = await Users.create({ email, password: hash, name });
    const me = await Users.findOne({
        attributes: ['userId', 'email', 'name', 'createdAt', 'updatedAt'],
        where: { email },
    });
    res.status(201).json({
        success: true,
        message: '회원가입에 성공했습니다.',
        data: me,
    });
});

//로그인 API
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    //email과 일치하는 유저 찾기
    const user = await Users.findOne({ where: { email } });
    //email에 해당하는 유저 없으면 오류
    if (!user) {
        res.status(400).json({
            errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
        });
        return;
    } else {
        //이메일에 해당하는 유저가 있다면 비밀번호 비교
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            //비밀번호 틀리면 오류
            res.status(400).json({
                errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
            });
            return;
        } else {
            //둘다 맞으면 jwt만들어주기
            const token = jwt.sign(
                { userId: user.userId },
                'customized-secret-key',
                { expiresIn: '12h' }
            );
            res.status(200).json({ token });
        }
    }
});

module.exports = router;
