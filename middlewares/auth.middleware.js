//인증 미들웨어
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
    //jwt토큰가져오기
    const { accessToken, refreshToken } = req.cookies;
    //토큰의 타입과 값 나누기
    const [authType, authToken] = (accessToken ?? '').split(' ');

    //토큰이 비었을때(만료되었거나 값이 없을 때)
    if (!authToken) {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
        return;
    }

    //토큰 타입이 bearer가 아닐때
    if (!authToken || authType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '인증 형태가 표준과 일치하지 않습니다.',
        });
        return;
    }

    try {
        //복호화 및 검증
        const { userId } = jwt.verify(authToken, process.env.MYSQL_TOKEN_KEY);
        //통과시 유저 정보 찾기
        const user = await Users.findOne({
            attributes: ['userId', 'email', 'name', 'createdAt', 'updatedAt'],
            where: { userId },
        });
        //찾은 유저 정보 저장
        res.locals.user = user;
        next();
    } catch (err) {
        res.status(401).send({
            errorMessage: '로그인이 필요합니다.',
        });
    }
};
