import { css } from '@emotion/react'
import BackgroundImage from './Background/backgroundImage'
import RegisterData from './RegisterData/registerData'
import Headers from './header/header'
import { useState } from 'react'


const SignUpPage = () => {
  // 각 필드에 대한 상태 관리
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")

  // 로그인 함수
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("닉네임:", nickname)
    console.log("이메일:", email)
    console.log("비밀번호:", password)
    console.log("비밀번호 확인:", checkPassword)
  };

  return (
    <>
      {/* 배경 이미지 */}
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
        `}
      >
        <BackgroundImage />
      </div>
      
      {/* 헤더 */}
      <Headers />

      {/* 로그인 폼 */}
      <form onSubmit={login} css={css`
        display : flex;
        flex-direction : column;
        justify-content : center;
      `}>
        <RegisterData value={"text"} placeholder={"닉네임"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}/>
        <RegisterData value={"text"} placeholder={"이메일"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
        <RegisterData value={"password"} placeholder={"비밀번호"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
        <RegisterData value={"password"} placeholder={"비밀번호 확인"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}/>
        <input type="submit" value="로그인" css={css`
          width: 122px;
          height: 45px;
        `}/>
      </form>
    </>
  );
};

export default SignUpPage;
