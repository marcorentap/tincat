import "./App.css";
import { motion, useAnimate, type PanInfo } from "motion/react";
import pawImg from "./assets/paw.png";
import CatPolaroid from "./components/CatPolaroid";
import { getCats, type CatData } from "./utils/Data";
import { useEffect, useState } from "react";

export default function App() {
  const [pawScope, animatePaw] = useAnimate();
  const [polaroidScope, animatePolaroid] = useAnimate();
  const [cats, setCats] = useState<CatData[]>([]);
  const [catIdx, setCatIdx] = useState<number>(-1);

  useEffect(() => {
    getCats().then((fetchedCats) => {
      setCats(fetchedCats);
      setCatIdx(fetchedCats.length - 1);
    });
  }, []);

  async function handleOnDragEnd(event: any, info: PanInfo) {
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

    // Remove paw
    await animatePaw(pawScope.current, { x: "0", y: "0" });
    console.log(cats);
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

    // Remove paw
    await animatePaw(pawScope.current, { x: "0%", y: "0%" });
    console.log(cats);
  }

  return (
    <>
      {catIdx < 0 && <>DONE</>}

      {catIdx >= 0 && (
        <div className="overflow-x-hidden">
          <motion.div
            drag="x"
            className="w-screen h-dvh select-none fixed z-50"
            onDragEnd={handleOnDragEnd}
            dragConstraints={{ left: 0, right: 0 }}
          ></motion.div>
          <motion.img
            className="fixed bottom-0 left-1/2 -translate-x-1/2 h-128 z-40"
            initial={{ translateY: "100%" }}
            animate={{ translateY: "65%" }}
            src={pawImg}
            ref={pawScope}
            alt="Logo"
          />

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
        </div>
      )}
    </>
  );
}
