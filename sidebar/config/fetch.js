import {
	baseUrl
} from './env'


// 参考 https://github.com/matthew-andrews/isomorphic-fetch/issues/30

function addItemsToForm(form, names, obj) {
  if (obj === undefined || obj === "" || obj === null) return addItemToForm(form, names, "");

  if (
    typeof obj == "string"
    || typeof obj == "number"
    || obj === true
    || obj === false
  ) return addItemToForm(form, names, obj);

  if (obj instanceof Date) return addItemToForm(form, names, obj.toJSON());

  // array or otherwise array-like
  if (obj instanceof Array) {
    return obj.forEach((v,i) => {
      names.push(`[${i}]`);
      addItemsToForm(form, names, v);
      names.pop();
    });
  }

  if (typeof obj === "object") {
    return Object.keys(obj).forEach((k)=>{
      names.push(k);
      addItemsToForm(form, names, obj[k]);
      names.pop();
    });
  }
}

function addItemToForm(form, names, value) {
  var name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
  value = encodeURIComponent(value.toString());
  form.push(`${name}=${value}`);
}


export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = baseUrl + url;

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			// credentials: 'include',
      credentials: "same-origin", //让浏览器加上cookie
			method: type,
			headers: {
				// 'Accept': 'application/json; charset=UTF-8',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'X-Requested-With' :'XMLHttpRequest'
      },
			// mode: "cors",
			// cache: "force-cache"
		}


		if (type == 'POST') {
      var form = [];
      //special handling for object/array data, arrays will use "model" as the container ns
      addItemsToForm(form, typeof data == 'object' ? [] : [options.name || 'model'], data);
      requestConfig.body = form.join('&');
			// Object.defineProperty(requestConfig, 'body', {
			// 	value: JSON.stringify(data)
			// })
		}


		try {
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
        var form = [];
        addItemsToForm(form, typeof data == 'object' ? [] : [options.name || 'model'], data);
				sendData = form.join('&');
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
