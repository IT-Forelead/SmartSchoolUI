let uuid = "";

const validateUUID = (uuid: string): boolean => {
  return /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/.test(
    uuid.toLowerCase(),
  );
};

export const getKeyPresses = (setUUID: (uuid: string) => void) => {
  return (event: KeyboardEvent) => {
    if (event.key === "Enter")
      if (validateUUID(uuid)) {
        setUUID(uuid);
        uuid = "";
      } else uuid = "";
    else if (/^[0-9a-f\-]$/i.test(event.key))
      uuid = uuid.slice(-35) + event.key.toLowerCase();
    else uuid = "";
  };
};
