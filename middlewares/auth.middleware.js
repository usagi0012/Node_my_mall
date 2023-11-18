//인증 미들웨어
const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    //jwt토큰가져오기
    const { authorization } = req.cookies;
    //토큰의 타입과 값을 배열 구조분해 할당으로 나눠줌
    const [authType, authToken] = (authorization ?? '').split(' ');

    //토큰이 비었을때(값이 없을 때) 또는 토큰 타입이 bearer가 아닐때
    if (!authToken || authType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
        return;
    }

    try {
        //복호화 및 검증
        const { userId } = jwt.verify(authToken, 'customized-secret-key');
        //통과시 유저 정보 찾기
        const user = await Users.findOne({ where: { userId } });
        //찾은 유저 정보 저장
        res.locals.user = user;
        next();
    } catch (err) {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};
