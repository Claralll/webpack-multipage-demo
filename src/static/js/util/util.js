export default {
	// 获取url参数值
	getUrlParam (name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let r = window.location.search.substr(1).match(reg);
		if (r !== null) return unescape(r[2]);
		return null;
	},
	// 设置页面title
	setTitle (title) {
		document.title = title

		var iframe = document.createElement('iframe');
		iframe.src = '/favicon.ico'
		iframe.style.display = 'none'
		iframe.id = 'title'
		iframe.onload = function() {
		    setTimeout(function() {
		        iframe.remove();
		    }, 9);
		};
		document.body.appendChild(iframe);
	}
}