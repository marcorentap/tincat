import "./App.css";
import { motion, useAnimate, type PanInfo } from "motion/react";
import pawImg from "./assets/paw.png";
import CatPolaroid from "./components/CatPolaroid";
import { getCats, type CatData } from "./utils/Data";
import { useEffect, useState } from "react";
import Instruction from "./components/Instruction";

export default function App() {
  const [pawScope, animatePaw] = useAnimate();
  const [polaroidScope, animatePolaroid] = useAnimate();
  const [cats, setCats] = useState<CatData[]>([]);
  const [catIdx, setCatIdx] = useState<number>(-1);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    getCats().then((fetchedCats) => {
      setCats(fetchedCats);
      setCatIdx(fetchedCats.length - 1);
      setDataLoaded(true);
    });
  }, []);

  async function handleOnDragEnd(_event: PointerEvent, info: PanInfo) {
    const threshold = 100;
    if (Math.abs(info.offset.x) < threshold) return;

    if (info.offset.x > 0) {
      onRightSwipe();
    } else {
      onLeftSwipe();
    }
  }

  async function onLeftSwipe() {
    // Move paw up
    await animatePaw(pawScope.current, { x: "-20%", y: "-50vh" });

    // Set like/dislike state
    const newCats = cats.map((cat, index): CatData => {
      if (index == catIdx) {
        return {
          ...cat,
          status: "disliked",
        };
      } else {
        return cat;
      }
    });
    setCats(newCats);
    setCatIdx((prevIdx) => prevIdx - 1);

    // Move paw down
    await animatePaw(
      pawScope.current,
      { x: "-20%", y: "-45vh" },
      { duration: 0.5 },
    );

    // Remove paw
    await animatePaw(pawScope.current, { x: "0", y: "0" });

    // Remove current cat
    animatePolaroid(
      polaroidScope.current.children[catIdx],
      {
        x: -100,
        y: 10,
        rotate: -30,
        opacity: 0,
      },
      { duration: 1 },
    );

    if (catIdx <= 0) {
      setComplete(true);
    }
  }

  async function onRightSwipe() {
    // Move paw up
    await animatePaw(pawScope.current, { x: "20%", y: "-50vh" });

    // Set like/dislike state
    const newCats = cats.map((cat, index): CatData => {
      if (index == catIdx) {
        return {
          ...cat,
          status: "liked",
        };
      } else {
        return cat;
      }
    });
    setCats(newCats);
    setCatIdx((prevIdx) => prevIdx - 1);

    // Make paw still for a while
    await animatePaw(
      pawScope.current,
      { x: "20%", y: "-45vh" },
      { duration: 0.5 },
    );

    // Remove paw
    await animatePaw(pawScope.current, { x: "0%", y: "0%" });

    // Remove current cat
    animatePolaroid(
      polaroidScope.current.children[catIdx],
      {
        x: 100,
        y: 10,
        rotate: 30,
        opacity: 0,
      },
      { duration: 1 },
    );

    if (catIdx <= 0) {
      setComplete(true);
    }
  }

  return (
    <>
      {dataLoaded && complete && (
        <div className="flex flex-col items-center justify-center w-screen">
          <p className="text-2xl font-sour-gummy my-5">
            You liked{" "}
            <span className="text-5xl">
              {cats?.filter((cat) => cat.status == "liked").length}
            </span>{" "}
            cats!
          </p>

          {cats
            ?.filter((cat) => cat.status == "liked")
            .map((cat, index) => (
              <div className="mb-5">
                <CatPolaroid
                  key={index}
                  imageUrl={cat.imageUrl}
                  name={cat.name}
                />
              </div>
            ))}
        </div>
      )}

      {dataLoaded && !complete && (
        <div className="overflow-x-hidden">
          <div className="fixed w-dvw h-dvh flex items-center justify-center z-50">
            <div className="absolute -translate-y-50">
              <Instruction />
            </div>
          </div>

          <div ref={polaroidScope}>
            {cats?.map((cat, index) => (
              <div
                key={index}
                className="w-dvw h-dvh fixed flex items-center justify-center"
              >
                <CatPolaroid
                  key={index}
                  imageUrl={cat.imageUrl}
                  name={cat.name}
                  status={cat.status ? cat.status : undefined}
                />
              </div>
            ))}
          </div>

          <motion.img
            className="fixed bottom-0 left-1/2 -translate-x-1/2 h-128 z-40"
            initial={{ translateY: "100%" }}
            animate={{ translateY: "65%" }}
            src={pawImg}
            ref={pawScope}
            alt="Logo"
          />

          <motion.div
            drag="x"
            className="w-screen h-dvh select-none fixed z-50"
            onDragEnd={handleOnDragEnd}
            dragConstraints={{ left: 0, right: 0 }}
          ></motion.div>
        </div>
      )}
    </>
  );
}
