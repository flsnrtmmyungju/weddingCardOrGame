'use client';
import styled from '@emotion/styled';

const IframeWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;
export default function page() {
  return (
    <IframeWrapper>
      <iframe src='/templatePage/1/index.html' width='100%' height='100%' style={{ border: 'none' }}></iframe>
    </IframeWrapper>
  );
}
