export default function (text, trans = []) {
  return text.replace(/__\((.+?)\)/g, (match, group) => {
    return trans[group] ? trans[group] : group;
  });
}