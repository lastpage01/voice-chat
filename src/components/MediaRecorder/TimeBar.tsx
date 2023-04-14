/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useState } from "react";

import "./style.css";
interface Props {
  url: string;
  isEndTime: boolean;
  audio: HTMLAudioElement | null;
}
const TimeBar = ({url, isEndTime, audio }: Props): JSX.Element => {
  const [styleTime, setStyleTime] = useState<React.CSSProperties>({
    width: `0%`,
  });
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  useEffect(() => {
    if (url)
      getTotalDuration(url).then((duration) => {
        setDuration(Number(duration));
      });
  }, [url]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, [audio]);

  useEffect(() => {
    if (duration !== 0) {
      setStyleTime({
        width: `${(currentTime / duration) * 100}%`,
      });
    }
    if (isEndTime === true)
      setStyleTime({
        width: `${100}%`,
      });
  }, [duration, currentTime, isEndTime]);

  const getTotalDuration = useCallback((url: string) => {
    return new Promise((resolve, reject) => {
      const context = new AudioContext();
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
          const duration = buffer.duration;
          resolve(duration);
        });
      };
      request.onerror = function () {
        reject(new Error("Error loading audio file"));
      };
      request.send();
    });
  }, []);
  return (
    <div className="wrapper-time-bar">
      <div className="time-bar" style={styleTime}></div>
    </div>
  );
};
export default memo(TimeBar);
