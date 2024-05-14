"use client";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [showImage, setImage] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const imgRef = useRef<null | HTMLImageElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    const file = event.target.files[0];
    setPredictions([]);

    reader.onload = async (e) => {
      const imgBuffer = reader.result;
      setImage(imgBuffer);
      if (imgRef.current == null) {
        console.log("Lütfen Resim Ekleyiniz");
      } else {
        convert(imgRef.current);
      }
    };

    reader.readAsDataURL(file);
  };

  const convert = async (img: HTMLImageElement) => {
    setLoading(true);
    require("@tensorflow/tfjs-core");
    require("@tensorflow/tfjs-backend-cpu");
    const mobilenet = require("@tensorflow-models/mobilenet");

    console.log("Loading Model....");
    const model = await mobilenet.load();

    console.log("Classifying Model...");
    const predictions = await model.classify(img);

    console.log("Predictions: ");
    console.log(predictions);
    setPredictions(predictions);
    setLoading(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.image_container}>
        <input type="file" name="file" onChange={handleUpload} />
        <img ref={imgRef} src={showImage} alt="image" />
        {isLoading && <p>Loading...</p>}
        {predictions
          .filter((prediction: any) => prediction.probability > 0.4)
          .map((prediction: any) => {
            return (
              <>
                <p>{prediction.className}</p>
                <p>{prediction.probability}</p>
              </>
            );
          })}
      </div>
    </div>
  );
}
