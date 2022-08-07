import React, {useEffect, useState} from "react";
import {IJsonData, JsonViewer} from "../../components";
import "./style.css";

const HomePage = () => {
  const [data, setData] = useState<IJsonData>();

  useEffect(() => {
    fetch("/data/example-data.json")
      .then((res) => res.json())
      .then((data) => {
        setData({
          data: {
            records: data,
          },
        });
      });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="homepage">
      <JsonViewer data={data} />
    </div>
  );
};

export default HomePage;
