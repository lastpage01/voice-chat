import React, { useRef, useState } from "react";

import { IconIc24FillMicrophone } from "@gapo_ui/icon";
import { IconIc24FillXmark } from "@gapo_ui/icon";
import { IconIc24FillPause } from "@gapo_ui/icon";
import { IconIc24FillPlay } from "@gapo_ui/icon";

import TimeRecord from "./TimeRecord";
import "./style.css";
import TimeBar from "./TimeBar";
import AudioWaveform from "./AudioWaveform";

const VoiceMessageMedia = () => {
  const [isRecordStart, setIsRecordStart] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isBtnPause, setIsBtnPause] = useState<boolean>(false);
  const [isEndTimeAudio, setIsEndTimeAudio] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const mediaRecorderRef = useRef<null | MediaRecorder>(null);
  const audioRef = useRef<null | HTMLAudioElement>(null);
  const timeOutId = useRef<NodeJS.Timeout | null>(null);
  const isCancelRef = useRef<boolean>(false);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMediaStream(stream);
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        const audioChunks: Blob[] = [];
        mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
          audioChunks.push(e.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
          handleEventStopMediaRecording(audioChunks);
        });

        timeOutId.current = setTimeout(() => {
          setIsRecording(false);
          setIsBtnPause(true);
          clearMediaStream();
        }, 600000);
      })
      .catch((e) => {
        console.log(e);
      });
    setIsRecording(true);
    setIsRecordStart(true);
    isCancelRef.current = false;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsBtnPause(true);
    clearMediaStream();
  };

  const handleCancelRecording = () => {
    isCancelRef.current = true;
    setAudioURL("");
    setIsRecording(false);
    setIsRecordStart(false);
    clearMediaStream();
  };

  const handlePauseRecorded = () => {
    setIsBtnPause(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handlePlayRecorded = () => {
    setIsBtnPause(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleEventStopMediaRecording = (audioChunks: Blob[]) => {
    if (isCancelRef.current === false) {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioURL(URL.createObjectURL(audioBlob));
      audioRef.current = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current.addEventListener("ended", handleEventEndRecorded);
      audioRef.current.addEventListener("play", () => {
        setIsEndTimeAudio(false);
      });
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const handleEventEndRecorded = () => {
    setIsBtnPause(false);
    setIsEndTimeAudio(true);
  };

  const clearMediaStream = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    clearTimeout(timeOutId.current!);
    mediaRecorderRef.current = null;
    if (mediaStream)
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    setMediaStream(null);
  };

  return (
    <div className="wrapper-voice">
      {!isRecordStart ? (
        <div className="icon-mic" onClick={handleStartRecording}>
          <IconIc24FillMicrophone />
        </div>
      ) : (
        <div className="wrapper-recording">
          <div className="icon-cancel" onClick={handleCancelRecording}>
            <IconIc24FillXmark size={14} UNSAFE_style={{ paddingTop: "5px" }} />
          </div>
          <div className="recording">
            {isRecording ? (
              <div className="icon-record" onClick={handleStopRecording}>
                <IconIc24FillPlay
                  size={16}
                  UNSAFE_style={{ paddingTop: "5px" }}
                />
              </div>
            ) : isBtnPause ? (
              <div className="icon-record" onClick={handlePauseRecorded}>
                <IconIc24FillPause
                  size={16}
                  UNSAFE_style={{ paddingTop: "5px" }}
                />
              </div>
            ) : (
              <div className="icon-record" onClick={handlePlayRecorded}>
                <IconIc24FillPlay
                  size={16}
                  UNSAFE_style={{ paddingTop: "5px" }}
                />
              </div>
            )}
            <AudioWaveform isRecording={isRecording} stream={mediaStream} />
            {/* {isRecording ? (
              <AudioWaveform isRecording={isRecording} stream={mediaStream} />
            ) : (
              <TimeBar
                audio = {audioRef.current}
                url={audioURL}
                isEndTime={isEndTimeAudio}
              />
            )} */}
            <div className="time-recorder">
              <TimeRecord isRecording={isRecording} />
            </div>
          </div>
        </div>
      )}
      {audioURL && (
        <div style={{ margin: "100px 0" }}>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default VoiceMessageMedia;
