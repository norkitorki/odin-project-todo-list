import { saveAs } from 'file-saver';

export const DataStorage = (key) => {
  const object = { key };
 
  object.store = (data) => {
    localStorage.setItem(key, JSON.stringify(data));
  }

  object.retrieve = (customKey) => {
    return JSON.parse(localStorage.getItem(customKey || key));
  }

  object.clear = () => {
    localStorage.clear();
  }

  object.saveToFile = (args = { fileName: key, keys: [key] }) => {
    const obj = {};
    args.keys.forEach(k => obj[k] = localStorage.getItem(k));

    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
    saveAs(blob, args.fileName);
  }

  object.importFromFile = (fileContent) => {
    const data = JSON.parse(fileContent);
    Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
  }

  return object;
};
