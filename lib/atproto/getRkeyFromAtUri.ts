const parseAtUri = (atUri: string) => {
  const cleanedAtUri = atUri.replace("at://", "");
  const [did, ...rest] = cleanedAtUri.split("/");
  let rkey = "";
  if (rest.length > 0) {
    rkey = rest[rest.length - 1];
  }
  return { did, rkey };
};

export default parseAtUri;
