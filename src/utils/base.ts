export function setLocalStorageItem<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
} 

export function getLocalStorageItem<T>(key: string): T {
  return JSON.parse(localStorage.getItem(key) || '');
}

// TODO:优化
export function updateLocalStorageItem<T>(key: string, data: T & { key: string },  mode: 'add' | 'delete' | 'replace' = 'add') {
  const cur = getLocalStorageItem(key);
  let newData;
  if (mode === 'replace') {
    newData = data;
  } else if (cur instanceof Array) {
    if (mode === 'add') {

      newData = data instanceof Array ? [...cur, ...data] : [...cur, data];
    
    } else if (data instanceof Array) {
      
      const keyMap = data.reduce((res, item) => ({...res, [item.key]: 1}), {});
      newData = cur.reduce((res, item) => {
        if (!keyMap[item.key]) {
          res.push(item);
        }
        return res;
      }, [])

    } else {
      newData = cur.filter(item => item.key !== data.key);
    }
  } 
  
  setLocalStorageItem(key, newData);
} 

// TODO:更好的生成key方法
export const genKey = () => Math.floor(Math.random() * 100000)