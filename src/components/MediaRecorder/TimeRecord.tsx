import React, { memo, useEffect, useRef, useState } from "react";
type Props = {
  isRecording: boolean;
};
const TimeRecord = ({ isRecording }: Props): JSX.Element => {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    let countSecond: number = 0;
    let countMinute: number = 0;
    intervalRef.current = setInterval(() => {
      if (countSecond < 59) setSecond(++countSecond);
      else if (countMinute < 59) {
        countSecond = 0;
        setMinute(++countMinute);
        setSecond(0);
      } else clearInterval(intervalRef.current);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      clearInterval(intervalRef.current);
    }
  }, [isRecording]);

  return (
    <>
      {minute < 10 ? `0${minute}` : minute}:
      {second < 10 ? `0${second}` : second}
    </>
  );
};

export default memo(TimeRecord);
