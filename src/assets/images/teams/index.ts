const images = import.meta.glob("./*.png");

const getImagePaths = async () => {
  const paths = await Promise.all(
    Object.keys(images).map(async (key) => {
      const trainerName = key.substring(
        key.indexOf("./") + 2,
        key.indexOf(".png")
      );
      return [
        trainerName,

        await images[key]().then((val) => (val as { default: string }).default),
      ];
    })
  );
  return Object.fromEntries(paths);
};

const imagePaths: Record<string, string> = await getImagePaths();

export default imagePaths;
