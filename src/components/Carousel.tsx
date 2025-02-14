// biome-ignore lint/style/useImportType: <explanation>
import React, { useRef, useEffect } from "react";

interface Image {
  id: number;
  name: string;
  ingredients: string;
  image: string;
}

interface CarouselProps {
  selected: Image | null;
  setSelected: React.Dispatch<React.SetStateAction<Image | null>>;
  images: Image[];
}

const Carousel: React.FC<CarouselProps> = ({
  selected,
  setSelected,
  images,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const duplicatedImages = Array(30).fill(images).flat();

  const centerImageIndex = (scrollLeft: number, imageWidth: number) => {
    const centerPosition =
      scrollLeft + (carouselRef.current?.clientWidth || 0) / 2;
    return Math.floor(centerPosition / imageWidth);
  };

  const handleScrollEnd = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const imageWidth =
        carouselRef.current.scrollWidth / duplicatedImages.length;
      const centerIndex = centerImageIndex(scrollLeft, imageWidth);
      const centeredImage = duplicatedImages[centerIndex % images.length];
      setSelected(centeredImage);

      const targetScrollLeft =
        centerIndex * imageWidth -
        (carouselRef.current.clientWidth - imageWidth) / 2;
      carouselRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const debounceScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(handleScrollEnd, 150);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const carousel = carouselRef.current;

    if (carousel) {
      const initialIndex = Math.floor(duplicatedImages.length / 2);
      const imageWidth = carousel.scrollWidth / duplicatedImages.length;
      const targetScrollLeft =
        initialIndex * imageWidth - (carousel.clientWidth - imageWidth) / 2;
      carousel.scrollLeft = targetScrollLeft;

      setSelected(duplicatedImages[initialIndex % images.length]);

      carousel.addEventListener("scroll", debounceScroll);

      return () => {
        carousel.removeEventListener("scroll", debounceScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }
  }, [images, duplicatedImages.length, setSelected]);

  return (
    <div
      className="relative w-full max-w-4xl overflow-hidden mt-8 sm:mt-10 lg:mt-12"
      style={{ height: "40vh" }}
    >
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide items-center"
        style={{
          scrollSnapType: "none",
          scrollBehavior: "smooth",
          height: "100%",
        }}
      >
        {duplicatedImages.map((image, index) => {
          const isSelected = selected === image;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              // biome-ignore lint/style/useTemplate: <explanation>
              key={image.id + "-" + index}
              className={`cursor-pointer flex-shrink-0 transition-all duration-300 flex flex-col items-center ${
                isSelected ? "scale-110 z-10" : "scale-90 opacity-70"
              }`}
              style={{
                width: "calc(25% - 0.5rem)", // Reduce el ancho de cada elemento
                margin: "0.25rem", // Reduce los márgenes laterales
              }}
            >
              <img
                src={image.image}
                alt={image.name}
                className="w-full h-full object-contain rounded-2xl shadow-lg"
                style={{
                  maxHeight: isSelected ? "160px" : "130px", // Reduce el tamaño máximo de la imagen
                  border: "2px solid #888", // Reduce el borde
                  borderRadius: "8px", // Reduce el radio de los bordes
                }}
              />
              {isSelected && (
                <div className="mt-1 text-center">
                  {" "}
                  <p className="text-white text-lg font-medium">{image.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
