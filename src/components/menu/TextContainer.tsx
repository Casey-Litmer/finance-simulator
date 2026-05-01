import { CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";



interface FixedTextProps {
  text: string;
  maxWidth?: number | string;
  style?: CSSProperties;
}

export function FixedText(props: FixedTextProps) {
  const { text, maxWidth, style } = props;
  return (
    <div style={{
      maxWidth: maxWidth ?? '60%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      alignContent: 'center',
      ...style
    }}>
      {text}
    </div>
  );
};


export function PanText(props: FixedTextProps) {
  const { text, maxWidth, style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      
      // Only set a distance if text is actually wider than the box
      if (textWidth > containerWidth) {
        setDistance(textWidth - containerWidth);
      } else {
        setDistance(0);
      }
    }
  }, [text, maxWidth]);

  //=================================================================================
  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: maxWidth ?? '60%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        alignContent: 'center',
        ...style
      }}
    >
      <motion.span
        ref={textRef}
        initial={{ x: 0 }}
        animate={{ x: -distance }}
        transition={{
          duration: distance > 0 ? distance / 40 : 0, // Dynamic duration: 40px per second
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 1, // Pause for 1s at each end so it's readable
        }}
        style={{ display: 'inline-block', padding: 0 }}
      >
        {text}
      </motion.span>
    </div>
  );
}
