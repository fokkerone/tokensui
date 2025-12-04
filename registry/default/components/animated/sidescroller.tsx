'use client';
import { ZoomHoverImage } from '@merch/components';
import { useRef, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts';

import {
  motion,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  animate,
  easeInOut,
  AnimatePresence,
  MotionValue,
} from 'motion/react';

type Size = {
  width?: number;
  height?: number;
};

export function InfiniteBoxCarousel({
  children,
}: {
  children?: React.ReactNode;
}) {
  const boxCount = 11;
  const boxGap = 12;
  const delayPerBox = 0.15;

  const responsive = {
    default: {
      boxCount: 1.5,
    },
    md: {
      boxCount: 3,
    },
    lg: {
      boxCount: 4,
    },
  };
  const totalDelay = 1100 * ((boxCount - 1) * delayPerBox + 1.5); // last box's delay + animation time
  const containerClass = `flex gap-[12px] overflow-x-clip`;
  const ref = useRef<HTMLDivElement>(null);
  const [{ width, height }, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  const onResize = useDebounceCallback(setSize, 200);

  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    onResize,
  });
  const [boxAmount, setBoxAmount] = useState<number>(4);
  const [BoxWidth, setBoxWidth] = useState<number>(0);
  const [BoxInterval, setBoxInterval] = useState<null | ReturnType<
    typeof setInterval
  >>(null);

  useEffect(() => {
    if (width === undefined) return;

    let _boxAmount;
    // Repsonsive breakpoints
    if (width >= 768 && width < 1024) {
      _boxAmount = responsive.md.boxCount;
    } else if (width >= 1024) {
      _boxAmount = responsive.lg.boxCount;
    } else {
      _boxAmount = responsive.default.boxCount;
    }

    const newWidth = width / _boxAmount;

    boxes.forEach((box, i) => {
      const { start, _m } = box;
      box.start = newWidth * i;
      _m.stop();
      _m.set(0);
    });

    setBoxWidth(newWidth);
    setBoxAmount(_boxAmount);
  }, [width, height]);

  const boxes = useRef(
    Array.from({ length: boxCount }, (a, b) => {
      return {
        start: BoxWidth * b,
        _m: useMotionValue(0),
      };
    })
  ).current;

  useEffect(() => {
    console.log(
      'Mainthreat',
      boxes,
      BoxWidth,
      boxAmount,
      'Interval',
      BoxInterval
    );
    let intervalID: null | ReturnType<typeof setInterval> = null;

    if (BoxInterval) {
      clearInterval(BoxInterval);
      boxes.forEach((box, i) => {
        const { _m, start } = box;
        box._m.set(0);
      });
    }

    intervalID = setInterval(animateAll, totalDelay);
    setBoxInterval(intervalID);

    return () => {
      if (BoxInterval) {
        clearInterval(BoxInterval);
      }
    };
  }, [boxes, BoxWidth, boxAmount]);

  const animateAll = () => {
    boxes.forEach((box, i) => {
      const { _m, start } = box;
      if (_m.get() + start < -2 * BoxWidth) {
        let newX = _m.get() + boxCount * (BoxWidth + boxGap);
        _m.set(newX);
        let _this = boxes[i];
        boxes.splice(i, 1);
        boxes.push(_this);
      }
    });

    boxes.forEach((box, i) => {
      const { _m, start } = box;
      const x = _m.get() - (BoxWidth + boxGap);

      animate(_m, x, {
        duration: 1,
        ease: [0.1, 0.2, 0.3, 1],
        delay: i * delayPerBox,
      });
    });
  };

  return (
    <div className={containerClass} ref={ref}>
      {boxes.map((x, i) => {
        const { start, _m } = x;
        return <Box x={x} _m={_m} key={i} id={i} />;
      })}
    </div>
  );
}

const people = [
  {
    id: 0,
    name: 'Creola Katherine Johnson',
    profession: 'mathematician',
  },
  {
    id: 1,
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
  },
  {
    id: 2,
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
  },
  {
    id: 3,
    name: 'Percy Lavon Julian',
    profession: 'chemist',
  },
  {
    id: 4,
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
  },
  {
    id: 1,
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
  },
  {
    id: 2,
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
  },
  {
    id: 3,
    name: 'Percy Lavon Julian',
    profession: 'chemist',
  },
  {
    id: 4,
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
  },
  {
    id: 1,
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
  },
  {
    id: 2,
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
  },
  {
    id: 3,
    name: 'Percy Lavon Julian',
    profession: 'chemist',
  },
  {
    id: 4,
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
  },
];

const BoxContent = ({ id }) => {
  return (
    <div className="p-5 h-full bg-emerald-200">
      <h1 className="text-3xl text-gray-800 block">
        {people[Number(id)].name}
      </h1>
      <h2 className="text-2xl text-gray-700 block">
        {people[Number(id)].profession}
      </h2>
    </div>
  );
};
const Box = ({
  children,
  x,
  id,
  _m,
}: {
  children: React.ReactNode;
  x: MotionValue;
}) => {
  return (
    <motion.div
      key={id}
      style={{ x: _m }}
      className="overflow-hidden basis-[calc(100%/1.5)] md:basis-[calc(100%/3)] lg:basis-[calc(100%/4)] shrink-0 aspect-[3/4] bg-gray-200 rounded-2xl"
    >
      <BoxContent id={Number(id)} key={`id-${id}`} />
    </motion.div>
  );
};
