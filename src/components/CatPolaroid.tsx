import { useState } from "react";
import tapeImg from "../assets/tape.png";
import likedImg from "../assets/liked.png";
import dislikedImg from "../assets/disliked.png";

export type CatPolaroidProps = {
  imageUrl: string;
  name: string;
  tapeTR?: boolean;
  tapeTL?: boolean;
  tapeBL?: boolean;
  tapeBR?: boolean;
  status?: "liked" | "disliked";
};

function Tape() {
  return <img className="absolute w-48" src={tapeImg} />;
}

export default function CatPolaroid(props: CatPolaroidProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="pt-5 px-5 pb-5 bg-white shadow-xs relative">
      {props.tapeTR && <Tape />}

      {props.status == "liked" && (
        <img className="absolute rotate-30 right-5 top-10" src={likedImg} />
      )}

      {props.status == "disliked" && (
        <img className="absolute -rotate-15" src={dislikedImg} />
      )}

      {!loaded && <div className="h-64 w-64 bg-gray-200 animate-pulse" />}
      <img
        src={props.imageUrl}
        alt={props.name}
        className={`w-64 h-64 ${loaded ? "" : "hidden"}`}
        onLoad={() => setLoaded(true)}
      />

      <p className="text-xl text-center mt-2.5">{props.name}</p>
    </div>
  );
}
