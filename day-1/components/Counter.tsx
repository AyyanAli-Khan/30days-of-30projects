"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Counter = () => {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const time = useRef<NodeJS.Timeout | null>(null);

  const handleDuration = () => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setActive(false);
      setPause(false);

      if (time.current) {
        clearInterval(time.current);
      }
    }
  };

  const start = () => {
    if (timeLeft > 0) {
      setActive(true);
      setPause(false);
    }
  };

  const handlePause = (): void => {
    if (active) {
      setPause(true);
      setActive(false);
      if (time.current) {
        clearInterval(time.current);
      }
    }
  };

  const reset = (): void => {
    setActive(false);
    setPause(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (time.current) {
      clearInterval(time.current);
    }
  };


  useEffect(() => {
    if (active && !pause) {
      time.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(time.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (time.current) {
        clearInterval(time.current);
      }
    };
  }, [active, pause]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <>
      <div className="bg-zinc-800 w-full h-screen flex items-center flex-col gap-10 justify-center text-slate-300 p-4">
        <h1>Developed by Ayyan Ali Khan</h1>
        <div className="bg-slate-600 min-h-[38vh] w-full sm:w-2/3 sm:min-h-[40vh] md:w-1/2 lg:w-1/3  shadow-md shadow-grey-400 py-4 px-5 rounded-xl">
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-6">
            Counter Timer
          </h1>
          <div className="w-full h-20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Input
              onChange={handleDurationChange}
              type="number"
              min={0}
              placeholder="Enter time in seconds"
              className="w-full md:w-3/4 text-black text-lg"
            />
            <Button onClick={handleDuration} className="w-full md:w-auto">
              Set Time
            </Button>
          </div>
          <div className="w-full h-36 flex flex-col items-center justify-center mt-2">
            {/* Timer */}
            <div className="text-5xl md:text-6xl font-semibold w-full h-1/2 bg-grey-400 text-center py-4">
              <h1>{formatTime(timeLeft)}</h1>
            </div>

            <div className="w-full  h-1/2 flex flex-row  md:flex-row justify-evenly items-center pt-6 space-y-4 md:space-y-0 ">
              <Button  onClick={start} variant={"custom"}>
                {pause? 'Resume': 'Start'}
              </Button>
              <Button  onClick={handlePause} variant={"custom"}>
                Pause
              </Button>
              <Button  onClick={reset} variant={"custom"}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Counter;
