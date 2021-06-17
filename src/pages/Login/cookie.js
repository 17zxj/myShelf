/*
 * 设置cookie
 */
export const setCookie = (name, value, day) => {
    const date = new Date();
    date.setTime(date.getTime() + (day * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toGMTString()}`;
    document.cookie = `${name}=${value}; ${expires}`;
};
/*
 * 获取cookie
 */
export const getCookie = (name) => {
    const names = `${name}=`;
    const c = document.cookie.split(';');
    for (let i = 0; i < c.length; i += 1) {
        const d = c[i].trim();
        if (d.indexOf(names) === 0) {
            return d.substring(names.length, d.length);
        }
    }
    return '';
};
/*
 * 删除cookie
 */
export const deleteCookie = (name, value) => {
    const d = new Date('1970-01-01 00:00:00');
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${name}=${value}; ${expires}`;
};
