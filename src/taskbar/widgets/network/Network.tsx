import { useEffect, useState } from "react";

export function Network() {
  const [ip, setIp] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("https://api.ipify.org?format=json");
        const json = await data.json();

        setIp(json.ip);
      } catch (e) {
        setError(
          `Failed to fetch IP: ${
            e && typeof e === "object" && "message" in e ? e.message : ""
          }`
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <span>Loading IP...</span>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div title="Provided by ipify.org">{ip}</div>;
}
