'use client';
//#region //*import //#endregion
import styled from '@emotion/styled';
//#endregion

const IframeWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;
export default function MainCard() {
  return (
    <IframeWrapper>
      <iframe src='/templatePage/3/index.html' width='100%' height='100%' style={{ border: 'none' }}></iframe>
    </IframeWrapper>
  );
}
