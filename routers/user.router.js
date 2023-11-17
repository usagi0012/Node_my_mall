//회원가입 API
//이메일, 비번, 비번확인, 이름 넘겨서 회원가입 요청 (비번은 hash된 값을 저장)
//유효성 체크(이메일중복불가, 형식에 맞아야함. 비번최소6자 이상, 확인과 일치)
//회원가입 성공시 비번 제외 사용자 정보 반환.

const express = require('express');
const router = express.Router();

const { Users } = require('../models');
const db = require('../config/config');
const bcrypt = require('bcrypt');
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
    const user = Users.create({ email, password: hash, name });
    const results = {};
    res.status(201).json({
        success: true,
        message: '회원가입에 성공했습니다.',
        data: { results },
    });
});

module.exports = router;
