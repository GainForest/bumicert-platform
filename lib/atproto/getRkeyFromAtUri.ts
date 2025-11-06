const getRkeyFromAtUri = (atUri: string) => {
  const parts = atUri.split("/");
  if (parts.length < 2) {
    return "";
  }
  return parts[parts.length - 1];
};

export default getRkeyFromAtUri;
