import React, { memo, useEffect, useRef, useState } from "react";
import { WaveDiv } from "../styles/StyleWaveform";

import "./style.css";
interface Props {
  isRecording: boolean;
  stream: MediaStream | null;
}
const AudioWaveform = ({ isRecording, stream }: Props): JSX.Element => {
  const [bar, setBar] = useState<number[]>([]);
  const intervalId = useRef<any>(null);
  const mediaStreamRef = useRef<null | MediaStream>(null);

  useEffect(() => {
    if (isRecording && stream) {
      const { analyserNode, dataArray } = connectAudioContext(stream);
      // Lấy dữ liệu tần số và hiển thị kết quả
      intervalId.current = setInterval(function () {
        analyserNode.getByteFrequencyData(dataArray);
        let max = 0;
        for (var i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > max) {
            max = dataArray[i];
          }
        }
        const volume = Math.floor(max * 0.05);
        const height = volume < 3 ? 2 : volume;
        setBar((prev) => {
          if (prev.length < 100) return [...prev, height];
          return [...prev.slice(1), height];
        });
      }, 80);
    } else clearInterval(intervalId.current);

    return () => clearInterval(intervalId.current);
  }, [isRecording, stream]);

  const connectAudioContext = (stream: MediaStream) => {
    mediaStreamRef.current = stream;
    // Tạo AudioContext để xử lý dữ liệu audio
    const audioContext = new AudioContext();
    // Kết nối MediaStream vào AudioContext
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    var bufferLength = analyserNode.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    // Kết nối AnalyserNode vào AudioContext
    sourceNode.connect(analyserNode);
    return {
      analyserNode,
      dataArray,
    };
  };

  return (
    <div className="wrapper-wave">
      {bar.map((val,index) => {
        return <WaveDiv key={index} height = {val}></WaveDiv>;
      })}
    </div>
  );
};
export default memo(AudioWaveform);
