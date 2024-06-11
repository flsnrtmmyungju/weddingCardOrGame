'use client';
import { useEffect, useRef, useState } from 'react';

export default function MainFrame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [boxList, setBoxList] = useState<Box[]>([]);
  const [isJump, setIsJump] = useState<boolean>(false);
  const [jumpTimmer, setJumpTimmer] = useState<number>(0);

  class Box {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor() {
      this.x = 500;
      this.y = 200;
      this.width = 50;
      this.height = 50;
    }
  }
  const [dino, setDino] = useState({
    x: 10,
    y: 200,
    width: 50,
    height: 50,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const newCtx = canvas.getContext('2d');
    if (!newCtx) return;
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    canvas.style.border = '1px solid black ';
    newCtx.fillStyle = 'green';
    newCtx?.fillRect(10, 10, 100, 100);
    setCtx(newCtx);
    requestAnimationFrame(everyFrameStartF);
  }, [ctx]);

  const everyFrameStartF = () => {
    if (ctx) {
      const AnimationId = requestAnimationFrame(everyFrameStartF);

      setTimer((prevTimer) => prevTimer + 1);
      console.log('실행');

      ctx.clearRect(0, 0, canvasRef.current?.width ?? 0, canvasRef.current?.height ?? 0);

      if (timer % 60 === 0) {
        var box = new Box();
        setBoxList((prevBoxList) => [...prevBoxList, box]);
      }
      setBoxList((prevBoxList) =>
        prevBoxList
          .map((inbox, i, o) => {
            if (inbox.x < 0) {
              o.splice(i, 1);
            }
            inbox.x--;
            checkLocation(dino, inbox, AnimationId);
            ctx.fillStyle = 'red';
            ctx.fillRect(inbox.x, inbox.y, inbox.width, inbox.height);
            return inbox;
          })
          .filter(Boolean)
      );

      if (isJump === true) {
        setDino((prevDino) => ({
          ...prevDino,
          y: prevDino.y - 3,
        }));
        setJumpTimmer((prevTimer) => prevTimer + 1);
      }
      if (isJump === false) {
        if (dino.y < 200) {
          setDino((prevDino) => ({
            ...prevDino,
            y: prevDino.y + 1,
          }));
        }
      }
      if (jumpTimmer > 100) {
        setIsJump(false);
        setJumpTimmer(0);
      }
      ctx.fillStyle = 'green';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }
  };
  const checkLocation = (dino: any, box: Box, AnimationId: any) => {
    var xCheck = box.x - (dino.x + dino.width);
    var yCheck = box.y - (dino.y + dino.height);
    if (box.x < xCheck && box.x + box.width > dino.x && box.y < yCheck && box.y + box.height > dino.y) {
      setTimeout(() => {
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          cancelAnimationFrame(AnimationId);
        }
      }, 0);
    }
  };
  return (
    <>
      <canvas ref={canvasRef} width={300} height={150} />
      <button onClick={() => setIsJump(true)}>점프</button>
    </>
  );
}
