import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const rect = element.getBoundingClientRect();
  if (
    coordinate.x > rect.left &&
    coordinate.x < rect.right &&
    coordinate.y > rect.top &&
    coordinate.y < rect.bottom
  ) {
    return true;
  }
  return false;
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const inlineElement = element.querySelector(
    "span, a, em, i, strong, b, u, s, strike, sub, sup, tt, var, cite, code, dfn, kbd, samp, abbr, acronym, big, small, font, label, legend, q, button, input, select, textarea, progress",
  );
  if (inlineElement && inlineElement.textContent === element.textContent) {
    const computedStyle = getComputedStyle(inlineElement);
    return parseFloat(computedStyle.fontSize);
  } else {
    const computedStyle = getComputedStyle(element); 
    return parseFloat(computedStyle.fontSize);
  }
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[],
): HoveredElementInfo | null {
  const [hoveredElement, setHoveredElement] =
    useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      let foundEle: HTMLElement | null = null;

      for (const element of parsedElements) {
        const bounds = element.getBoundingClientRect();
        if (
          event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom
        ) {
          foundEle = element;
          break;
        }
      }
      if (foundEle) {
        const bounds = foundEle.getBoundingClientRect();
        const heightOfFirstLine = getLineHeightOfFirstLine(foundEle);
        setHoveredElement({
          element: foundEle,
          top: bounds.top,
          left: bounds.left,
          heightOfFirstLine: heightOfFirstLine,
        });
      } else {
        setHoveredElement(null);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredElement;
}
