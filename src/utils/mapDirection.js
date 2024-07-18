const mapDirection = (dirCode) => {
  switch (dirCode) {
    case "E":
      return "동";
    case "W":
      return "서";
    case "S":
      return "남";
    case "N":
      return "북";
    default:
      return dirCode;
  }
};

export default mapDirection;
