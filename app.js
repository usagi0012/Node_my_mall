const express = require('express');
const port = 3003;
const usersRouter = require('./routers/user.router');
const productsRouter = require('./routers/post.router');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter], [productsRouter]);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});

//회원가입 API
//이메일, 비번, 비번확인, 이름 넘겨서 회원가입 요청 (비번은 hash된 값을 저장)
//유효성 체크(이메일중복불가, 형식에 맞아야함. 비번최소6자 이상, 확인과 일치)
//회원가입 성공시 비번 제외 사용자 정보 반환.
