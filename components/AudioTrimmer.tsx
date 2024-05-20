"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import Regions from "wavesurfer.js/dist/plugins/regions.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import WaveSurfer from "wavesurfer.js";
import { useFile } from "@/context/FileContext";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import { useRouter } from "next/navigation";

const AudioTrimmer = () => {
  const wavesurferRef = useRef(null);
  const timelineRef = useRef(null);
  // fetch file url from the context
  const { fileURL, setFileURL } = useFile();
  const router = useRouter();
  // crate an instance of the wavesurfer
  const [wavesurferObj, setWavesurferObj] = useState<any>();
  const wsRegions = useRef(null);

  const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
  const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
  const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
  const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio
  const [regionState, setRegionState] = useState<any>({
    start: 1,
    end: 9,
  });
  const regionVal = useRef({
    start: 1,
    end: 9,
  });

  // create the waveform inside the correct component
  useEffect(() => {
    if (wavesurferRef.current && !wavesurferObj) {
      setWavesurferObj(
        WaveSurfer.create({
          container: "#waveform",
          waveColor: "#29d63e",
          progressColor: "#383351",
          url: "/audio.mp3",
          dragToSeek: true,
          plugins: [
            RegionsPlugin.create(),
            TimelinePlugin.create({
              container: "#wave-timeline",
            }),
            ZoomPlugin.create({
              // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
              scale: 0.5,
              // Optionally, specify the maximum pixels-per-second factor while zooming
              maxZoom: 100,
            }),
          ],
        })
      );
      //   wsRegions.current = wavesurferObj.registerPlugin(RegionsPlugin.create());
    }
  }, [wavesurferRef, wavesurferObj]);

  // once the file URL is ready, load the file to produce the waveform
  useEffect(() => {
    if (fileURL && wavesurferObj) {
      wavesurferObj.load(fileURL);
    }
  }, [fileURL, wavesurferObj]);

  useEffect(() => {
    if (wavesurferObj) {
      // once the waveform is ready, play the audio
      wavesurferObj.on("ready", () => {
        wavesurferObj.play();
        // wavesurferObj.enableDragSelection({}); // to select the region to be trimmed
        setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
      });

      // once audio starts playing, set the state variable to true
      wavesurferObj.on("play", () => {
        setPlaying(true);
      });

      // once audio finishes playing, set the state variable to false
      wavesurferObj.on("finish", () => {
        setPlaying(false);
      });

      const wsRegions = wavesurferObj.registerPlugin(RegionsPlugin.create());
      wavesurferObj.on("decode", () => {
        // wavesurferObj.addRegion
        wsRegions.addRegion({
          start: 1,
          end: 9,
          content: "",
          color: "rgba(38, 54, 246, 0.6)",
          drag: false,
          resize: true,
        });
      });
      wsRegions.on("region-updated", (region: any) => {
        console.log("Updated region", regionVal.current);
        regionVal.current = { start: region.start, end: region.end };
        console.log(regionVal.current);
      });
    }
  }, [wavesurferObj]);

  // set volume of the wavesurfer object, whenever volume variable in state is changed
  useEffect(() => {
    if (wavesurferObj) wavesurferObj.setVolume(volume);
  }, [volume, wavesurferObj]);

  const handlePlayPause = (e: any) => {
    wavesurferObj.playPause();
    setPlaying(!playing);
  };

  const handleReload = (e: any) => {
    // stop will return the audio to 0s, then play it again
    wavesurferObj.stop();
    wavesurferObj.play();
    setPlaying(true); // to toggle the play/pause button icon
  };

  const handleVolumeSlider = (e: any) => {
    setVolume(e.target.value);
  };

  const handleZoomSlider = (e: any) => {
    setZoom(e.target.value);
  };

  function readAudio(file: string | Blob) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      //Resolve if audio gets loaded
      reader.onload = function () {
        console.log("Audio Loaded");
        resolve(reader);
      };

      reader.onerror = function (error) {
        console.log("Error while reading audio");
        reject(error);
      };

      reader.onabort = function (abort) {
        console.log("Aborted");
        console.log(abort);
        reject(abort);
      };
    });
  }

  const handleTrim = async (e: any) => {
    // fileURL("")
    // const newUrl = fileURL.replace("raw", "audio");
    // setFileURL(
    //   `${newUrl}?f=mp3&ts=${Math.trunc(
    //     regionVal.current.start
    //   )}&te=${Math.trunc(regionVal.current.end)}`
    // );

    // const context = new AudioContext();
    // function play(audioBuffer: AudioBuffer | null) {
    //   var source = context.createBufferSource();
    //   source.buffer = audioBuffer;
    //   source.connect(context.destination);
    //   source.start(0);
    // }
    // async function fetchAndPlay() {
    //   context.decodeAudioData(
    //     await fetch(`${newUrl}?f=mp3&ts=${Math.trunc(
    //         regionVal.current.start
    //       )}&te=${Math.trunc(regionVal.current.end)}`).then((r) => r.arrayBuffer()),
    //     (decoded) => play(decoded)
    //   );
    // }
    // fetchAndPlay();
    // router.push("/edit");
    // wavesurferObj.load(fileURL)
    const startTime = parseFloat(regionVal.current.start);
    const endTime = parseFloat(regionVal.current.end);
    let arrayBufferr = null;
    // const file = audioFileInput.files[0];
    let blob = await fetch(fileURL).then((r) => r.blob());
    // await readAudio(blob)
    //   .then((results) => {
    //     arrayBuffer = results.result;
    //   })
    //   .catch((error) => {
    //     window.alert("Some Error occured");
    //     return;
    //   });
    arrayBufferr = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext || AudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBufferr);
    const duration = endTime - startTime;
    const offlineAudioContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.sampleRate * duration,
      audioBuffer.sampleRate
    );
    const source = offlineAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineAudioContext.destination);
    source.start(0, startTime, duration);
    const renderedBuffer = await offlineAudioContext.startRendering();
    // const trimmedAudioBlob = bufferToWaveBlob(renderedBuffer);
    // setFileURL()
    wavesurferObj.load(renderedBuffer);
    console.log(fileURL);
  };

  return (
    <section className="flex flex-col w-[80vw] gap-10 justify-center m-auto">
      <div ref={wavesurferRef} id="waveform" />
      <div ref={timelineRef} id="wave-timeline" />
      <div className="flex gap-5">
        <div className=" flex gap-10">
          {/* <ToggleButton /> */}
          <button
            title="play/pause"
            className="text-3xl"
            onClick={handlePlayPause}
          >
            {playing ? (
              <i className="material-icons">pause</i>
            ) : (
              <i className="material-icons">play</i>
            )}
          </button>
          <button title="reload" className="text-3xl" onClick={handleReload}>
            <i className="material-icons">replay</i>
          </button>
          <button className="trim" onClick={handleTrim}>
            Trim
          </button>
        </div>
        <div className="right-container">
          <div className="volume-slide-container">
            {volume > 0 ? (
              <i className="material-icons">volume_up</i>
            ) : (
              <i className="material-icons">volume_off</i>
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeSlider}
              className="slider volume-slider"
              id="zoom"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudioTrimmer;
