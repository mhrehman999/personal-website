export const motionTokens = {
  easing: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
  duration: {
    fast: 200,
    base: 400,
    slow: 700,
    hero: 1100,
  },
  reveal: {
    distance: 32,
    stagger: 70,
    trigger: "top 85%",
  },
  scroll: {
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  },
  marquee: {
    speed: 40,
    minimumSpeed: 0.45,
    maximumSpeed: 2.2,
  },
} as const;

type CubicBezier = (progress: number) => number;

function cubicBezier(x1: number, y1: number, x2: number, y2: number): CubicBezier {
  const curve = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  const slope = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t ** 2 * (1 - b);

  return (progress) => {
    const target = Math.min(1, Math.max(0, progress));
    let parameter = target;

    for (let iteration = 0; iteration < 8; iteration += 1) {
      const difference = curve(parameter, x1, x2) - target;
      const derivative = slope(parameter, x1, x2);
      if (Math.abs(difference) < 0.00001 || Math.abs(derivative) < 0.00001) break;
      parameter -= difference / derivative;
    }

    return curve(Math.min(1, Math.max(0, parameter)), y1, y2);
  };
}

export const motionEases = {
  out: cubicBezier(0.16, 1, 0.3, 1),
  inOut: cubicBezier(0.65, 0, 0.35, 1),
} satisfies Record<keyof typeof motionTokens.easing, CubicBezier>;
