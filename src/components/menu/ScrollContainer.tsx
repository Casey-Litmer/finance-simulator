import { ReactNode, useEffect, useRef, useState } from 'react';
import './Menu.css';


interface ScrollContainerProps {
  children?: ReactNode;
};

export default function ScrollContainer(props: ScrollContainerProps) {
  const { children } = props;
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(1000);

  //=========================================================================================
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setMaxHeight(entry.contentRect.height);
    });
    observer.observe(containerDivRef.current!.parentElement!);
    return () => observer.disconnect();
  }, []);

  //=========================================================================================
  return (
    <div className='ScrollContainer' ref={containerDivRef}
      style={{ maxHeight }}>
      {children}
    </div>
  );
};
