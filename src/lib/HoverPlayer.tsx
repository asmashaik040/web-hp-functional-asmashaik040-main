import React, { useEffect, useState } from 'react'
import { HoveredElementInfo, useHoveredParagraphCoordinate } from './hook';
import { speechify } from './play';

// This is a simple play button SVG that you can use in your hover player
const PlayButton = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    id="play-icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: "pointer",
      background: "#6B78FC",
      borderRadius: "50%",
    }}
    {...props}
  >
    <path
      d="M16.3711 11.3506C16.8711 11.6393 16.8711 12.361 16.3711 12.6497L10.3711 16.1138C9.87109 16.4024 9.24609 16.0416 9.24609 15.4642L9.24609 8.53603C9.24609 7.95868 9.87109 7.59784 10.3711 7.88651L16.3711 11.3506Z"
      fill="white"
    />
  </svg>
);

/**
 * **TBD:**
 * Implement a hover player that appears next to the paragraph when the user hovers over it
 * The hover player should contain a play button that when clicked, should play the text of the paragraph
 * This component should make use of the useHoveredParagraphCoordinate hook to get information about the hovered paragraph
 */


const HoverPlayer: React.FC = () => {

  const paragraphHoverInfo = useHoveredParagraphCoordinate(Array.from(document.querySelectorAll('p, blockquote')));
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredElementInfo, setHoveredElementInfo] = useState<HoveredElementInfo | null>(null);
  const [isBtnHidden, setIsBtnHidden] = useState(false);

  useEffect(() => {
    if (paragraphHoverInfo) {
      setHoveredElementInfo(paragraphHoverInfo);
    }
  }, [paragraphHoverInfo])

  useEffect(() => {
    if (!paragraphHoverInfo && !isButtonHovered) {
      setIsBtnHidden(true)
    } else {
      setIsBtnHidden(false);
    }
  }, [paragraphHoverInfo, isButtonHovered])

  const handlePlay = () => {
    if (hoveredElementInfo?.element) {
      speechify(hoveredElementInfo?.element)
    }
  }

  if (!hoveredElementInfo) { return null }

  if (!isBtnHidden) { return null }

  const blockpos = hoveredElementInfo.element.getBoundingClientRect();

  return (
    <PlayButton
      id={blockpos ? 'hover-player' : 'play-icon'}
      style={{
        position: 'fixed',
        left: blockpos ? `${hoveredElementInfo.left - 35}px` : '30px',
        top: `${hoveredElementInfo?.top}px`,
        cursor: 'pointer',
        background: 'blue',
        borderRadius: '50%',
        padding: '7px'
      }}
      onClick={handlePlay}
      onMouseEnter={() => { setIsButtonHovered(true) }}
      onMouseLeave={() => { setIsButtonHovered(false) }} />
  )
}

export default HoverPlayer;